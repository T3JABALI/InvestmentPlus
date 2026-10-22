
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const crypto = require('crypto');
const { pool } = require('../db/pool');
const { sendVerificationEmail } = require('../services/email');
const {
  generateVerificationToken,
  hashVerificationToken,
  getVerificationExpiry,
} = require('../services/verification');

const router = express.Router();

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters.')
  .max(72, 'Password must not exceed 72 characters.')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter.')
  .regex(/[a-z]/, 'Password must contain a lowercase letter.')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character.');

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: passwordSchema,
  referralCode: z.string().trim().max(20).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

const verifySchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i),
});

const emailSchema = z.object({
  email: z.string().trim().email().max(254),
});

function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with a strong secret.');
  }

  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
      issuer: 'investmentplus-api',
      audience: 'investmentplus-web',
    }
  );
}

function publicUser(user) {
  return {
    id: String(user.id),
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    emailVerified: user.email_verified,
    createdAt: user.created_at,
  };
}

// Verify a JWT and confirm that the account still exists.
async function requireAuth(req, res, next) {
  try {
    const authorization = req.get('Authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication is required.',
      });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        error: 'Authentication is required.',
      });
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET is not configured correctly.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'investmentplus-api',
      audience: 'investmentplus-web',
    });

    if (!decoded.sub || !/^\d+$/.test(String(decoded.sub))) {
      return res.status(401).json({
        error: 'Invalid or expired authentication token.',
      });
    }

    const result = await pool.query(
      `SELECT id, full_name, email, role, email_verified, created_at
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [decoded.sub]
    );

    if (!result.rowCount) {
      return res.status(401).json({
        error: 'This account no longer exists.',
      });
    }

    const user = result.rows[0];

    if (!user.email_verified) {
      return res.status(403).json({
        error: 'Please verify your email address.',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    // Use the current database role, not just the JWT role.
    req.user = publicUser(user);
    next();
  } catch (err) {
    if (
      err.name === 'JsonWebTokenError' ||
      err.name === 'TokenExpiredError' ||
      err.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        error: 'Invalid or expired authentication token.',
      });
    }

    next(err);
  }
}

function generateReferralCode() {
  return `IP${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}
// REGISTER
router.post('/register', async (req, res, next) => {
  let client;

  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Please check your registration details.',
        details: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const { fullName, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();
    const referralCode = parsed.data.referralCode
      ? parsed.data.referralCode.trim().toUpperCase()
      : null;

    const newReferralCode = generateReferralCode();
    const passwordHash = await bcrypt.hash(password, 12);

    const rawToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(rawToken);

    client = await pool.connect();

    let user;

    try {
      await client.query('BEGIN');

      let referrerId = null;

if (referralCode) {
  const referrerResult = await client.query(
    `SELECT id
     FROM users
     WHERE referral_code = $1
     LIMIT 1`,
    [referralCode]
  );

  if (!referrerResult.rowCount) {
    await client.query('ROLLBACK');

    return res.status(400).json({
      error: 'The referral code is invalid.',
      code: 'INVALID_REFERRAL_CODE',
    });
  }

  referrerId = referrerResult.rows[0].id;
}

const result = await client.query(
  `INSERT INTO users (
     full_name,
     email,
     password_hash,
     referral_code,
     referred_by
   )
   VALUES ($1, $2, $3, $4, $5)
   ON CONFLICT DO NOTHING
   RETURNING id, full_name, email, role, email_verified, created_at`,
  [
    fullName,
    email,
    passwordHash,
    newReferralCode,
    referrerId,
  ]
);

      if (!result.rowCount) {
        await client.query('ROLLBACK');

        return res.status(409).json({
          error: 'An account with that email may already exist. Try logging in.',
        });
      }

      user = result.rows[0];

      await client.query(
        `INSERT INTO email_verification_tokens
          (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, tokenHash, getVerificationExpiry()]
      );

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
      client = null;
    }

    try {
      await sendVerificationEmail({
        to: email,
        token: rawToken,
      });
    } catch (emailError) {
      console.error(
        'Verification email delivery failed:',
        emailError.message
      );

      // Invalidate this verification link using the existing table.
      await pool
        .query(
          `UPDATE email_verification_tokens
           SET used_at = NOW()
           WHERE token_hash = $1 AND used_at IS NULL`,
          [tokenHash]
        )
        .catch((dbError) => {
          console.error(
            'Failed to invalidate verification token:',
            dbError.message
          );
        });

      return res.status(503).json({
        error: 'Your account was created, but the verification email could not be sent. Please contact support.',
        code: 'VERIFICATION_EMAIL_FAILED',
      });
    }

    return res.status(201).json({
      message: 'Account created. Check your email for a verification link.',
      user: publicUser(user),
    });
  } catch (err) {
    if (client) client.release();
    next(err);
  }
});

// VERIFY EMAIL
router.post('/verify-email', async (req, res, next) => {
  let client;

  try {
    const parsed = verifySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'The verification link is invalid or has expired.',
      });
    }

    const tokenHash = hashVerificationToken(parsed.data.token);

    client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `SELECT id, user_id
         FROM email_verification_tokens
         WHERE token_hash = $1
           AND used_at IS NULL
           AND expires_at > NOW()
         FOR UPDATE`,
        [tokenHash]
      );

      if (!result.rowCount) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          error: 'The verification link is invalid, expired, or already used.',
        });
      }

      const verification = result.rows[0];

      await client.query(
        `UPDATE users
         SET email_verified = TRUE, updated_at = NOW()
         WHERE id = $1`,
        [verification.user_id]
      );

      // Invalidate every outstanding verification link for this user.
      await client.query(
        `UPDATE email_verification_tokens
         SET used_at = NOW()
         WHERE user_id = $1 AND used_at IS NULL`,
        [verification.user_id]
      );

      await client.query('COMMIT');

      return res.json({
        message: 'Email verified successfully. You can now log in.',
      });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
      client = null;
    }
  } catch (err) {
    if (client) client.release();
    next(err);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Enter a valid email address and password.',
      });
    }

    const email = parsed.data.email.toLowerCase();

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role,
              email_verified, created_at
       FROM users
       WHERE LOWER(email) = $1
       LIMIT 1`,
      [email]
    );

    const user = result.rows[0];

    const passwordMatches = user
      ? await bcrypt.compare(parsed.data.password, user.password_hash)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error: 'Please verify your email address before logging in.',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    const token = createToken(user);

    return res.json({
      message: 'Login successful.',
      token,
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// GET CURRENT AUTHENTICATED USER
router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

// PASSWORD RESET
// Intentionally unavailable until password-reset token storage exists.
router.post('/forgot-password', async (req, res) => {
  const parsed = emailSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Enter a valid email address.',
    });
  }

  return res.status(501).json({
    error: 'Password reset is not available yet. Please contact support.',
    code: 'PASSWORD_RESET_UNAVAILABLE',
  });
});

router.post('/reset-password', (req, res) => {
  return res.status(501).json({
    error: 'Password reset is not available yet. Please contact support.',
    code: 'PASSWORD_RESET_UNAVAILABLE',
  });
});

module.exports = router;
