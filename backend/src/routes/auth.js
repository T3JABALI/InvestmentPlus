
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod');
const { pool } = require('../db/pool');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../services/email');
const {
  generateVerificationToken,
  hashVerificationToken,
  getVerificationExpiry,
} = require('../services/verification');

const router = express.Router();

const passwordSchema = z.string()
  .min(8, 'Password must contain at least 8 characters.')
  .max(72, 'Password must not exceed 72 characters.')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter.')
  .regex(/[a-z]/, 'Password must contain a lowercase letter.')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character.');

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: passwordSchema,
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

const verifySchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i),
});
const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
});

const resetPasswordSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i),
  password: passwordSchema,
});

function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with a strong secret.');
  }

  return jwt.sign(
    { sub: String(user.id), role: user.role },
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

router.post('/register', async (req, res, next) => {
  let client;

  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Please check your registration details.',
        details: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const { fullName, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    const rawToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(rawToken);

    client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO users (full_name, email, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING
         RETURNING id, full_name, email, role, email_verified, created_at`,
        [fullName, email, passwordHash]
      );

      if (!result.rowCount) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          error: 'An account with that email may already exist. Try logging in.',
        });
      }

      await client.query(
        `INSERT INTO email_verification_tokens
           (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [result.rows[0].id, tokenHash, getVerificationExpiry()]
      );

      await client.query('COMMIT');

      try {
        await sendVerificationEmail({ to: email, token: rawToken });
      } catch (emailError) {
        await pool.query(
          `UPDATE password_reset_tokens
           SET used_at = NOW()
           WHERE token_hash = $1 AND used_at IS NULL`,
           [tokenHash]
        );

        console.error(
          'Password reset email delivery failed:',
          emailError.message
        );

        return res.status(503).json({
          error: 'Unable to send a password reset email right now. Please try again later.',
        });
      }

      return res.status(201).json({
        message: 'Account created. Check your email for a verification link.',
        user: publicUser(result.rows[0]),
      });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

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

      await client.query(
        `UPDATE email_verification_tokens
         SET used_at = NOW()
         WHERE id = $1`,
        [verification.id]
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
    }
  } catch (err) {
    next(err);
  }
});

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

router.post('/forgot-password', async (req, res, next) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Enter a valid email address.',
      });
    }

    const email = parsed.data.email.toLowerCase();

    const result = await pool.query(
      `SELECT id, email FROM users WHERE LOWER(email) = $1 LIMIT 1`,
      [email]
    );

    // Return the same response whether or not the account exists.
    const message =
      'If an account exists for that email, a password reset link will be sent.';

    if (!result.rowCount) {
      return res.json({ message });
    }

    const user = result.rows[0];
    const rawToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(rawToken);

    await pool.query(
      `UPDATE password_reset_tokens
       SET used_at = NOW()
       WHERE user_id = $1 AND used_at IS NULL`,
      [user.id]
    );

    await pool.query(
      `INSERT INTO password_reset_tokens
         (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, getVerificationExpiry()]
    );

    try {
      await sendPasswordResetEmail({
        to: user.email,
        token: rawToken,
      });
    
    } catch (emailError) {
      console.error(
        'Password reset email delivery failed:',
        emailError.message
      );

      await pool.query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE token_hash = $1 AND used_at IS NULL`,
        [tokenHash]
      ).catch((dbError) => {
        console.error(
          'Failed to invalidate password reset token:',
          dbError.message
        );
      });

      return res.status(503).json({
        error: 'Unable to send a password reset email right now. Please try again later.',
      });
    }


    return res.json({ message });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  let client;

  try {
    const parsed = resetPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'The reset link is invalid or the new password does not meet the requirements.',
      });
    }

    const { token, password } = parsed.data;
    const tokenHash = hashVerificationToken(token);
    const passwordHash = await bcrypt.hash(password, 12);

    client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `SELECT id, user_id
         FROM password_reset_tokens
         WHERE token_hash = $1
           AND used_at IS NULL
           AND expires_at > NOW()
         FOR UPDATE`,
        [tokenHash]
      );

      if (!result.rowCount) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'The reset link is invalid, expired, or already used.',
        });
      }

      const reset = result.rows[0];

      await client.query(
        `UPDATE users
         SET password_hash = $1, updated_at = NOW()
         WHERE id = $2`,
        [passwordHash, reset.user_id]
      );

      await client.query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE user_id = $1 AND used_at IS NULL`,
        [reset.user_id]
      );

      await client.query('COMMIT');

      return res.json({
        message: 'Password reset successfully. You can now log in with your new password.',
      });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});


module.exports = router;
