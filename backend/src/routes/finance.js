
const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/finance/overview
router.get('/overview', requireAuth, async (req, res) => {
  try {
   
const result = await pool.query(
  `SELECT
     COALESCE(SUM(
       CASE WHEN direction = 'credit' THEN amount ELSE -amount END
     ), 0)::text AS balance,

     COALESCE(SUM(
       CASE WHEN entry_type = 'deposit_credit' THEN amount ELSE 0 END
     ), 0)::text AS confirmed_deposits,

     COALESCE(SUM(
       CASE WHEN direction = 'credit' THEN amount ELSE 0 END
     ), 0)::text AS total_credits,

     COALESCE(SUM(
       CASE WHEN direction = 'debit' THEN amount ELSE 0 END
     ), 0)::text AS total_debits,

     COALESCE(SUM(
       CASE WHEN entry_type = 'withdrawal_reservation'
         THEN amount ELSE 0 END
     ), 0)::text AS withdrawal_reservations

   FROM financial_ledger
   WHERE user_id = $1`,
  [req.user.id]
);



    const totals = result.rows[0];
    const balance = (
      Number(totals.total_credits) - Number(totals.total_debits)
    ).toFixed(2);

    return res.json({
      currency: 'KES',
      balance,
      confirmedDeposits: totals.confirmed_deposits,
      totalCredits: totals.total_credits,
      totalDebits: totals.total_debits,
      withdrawalReservations: totals.withdrawal_reservations,
      source: 'database',
    });
  } catch (error) {
    console.error('Finance overview error:', error);
    return res.status(500).json({
      error: 'Unable to load financial overview.',
    });
  }
});

// GET /api/finance/transactions
router.get('/transactions', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM (
         SELECT
           id::text AS id,
           'deposit'::text AS type,
           amount::text AS amount,
           currency,
           status,
           COALESCE(provider_reference, api_ref::text) AS reference,
           created_at
         FROM deposit_requests
         WHERE user_id = $1

         UNION ALL

         SELECT
           id::text AS id,
           'withdrawal'::text AS type,
           amount::text AS amount,
           currency,
           status,
           payout_reference AS reference,
           created_at
         FROM withdrawal_requests
         WHERE user_id = $1
       ) AS transactions
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.user.id]
    );

    return res.json({
      transactions: result.rows,
      source: 'database',
    });
  } catch (error) {
    console.error('Finance transactions error:', error);
    return res.status(500).json({
      error: 'Unable to load transactions.',
    });
  }
});

 // GET /api/finance/earnings
 // Shows real referral commissions recorded in the ledger.
router.get('/earnings', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id::text AS id,
         entry_type,
         amount::text AS amount,
         currency,
         description,
         reference_type,
         reference_id,
         created_at
       FROM financial_ledger
       WHERE user_id = $1
         AND entry_type = 'referral_commission'
         AND direction = 'credit'
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.user.id]
    );

    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0)::text AS total
       FROM financial_ledger
       WHERE user_id = $1
         AND entry_type = 'referral_commission'
         AND direction = 'credit'`,
      [req.user.id]
    );

    return res.json({
      currency: 'KES',
      total: totalResult.rows[0].total,
      earnings: result.rows,
      source: 'database',
    });
  } catch (error) {
    console.error('Finance earnings error:', error);
    return res.status(500).json({
      error: 'Unable to load earnings.',
    });
  }
});

// GET /api/finance/withdrawals
router.get('/withdrawals', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id::text AS id,
         amount::text AS amount,
         fee::text AS fee,
         currency,
         destination_phone,
         status,
         payout_reference,
         admin_note,
         created_at,
         updated_at,
         reviewed_at,
         paid_at
       FROM withdrawal_requests
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.user.id]
    );

    return res.json({
      currency: 'KES',
      withdrawals: result.rows,
      source: 'database',
    });
  } catch (error) {
    console.error('Finance withdrawals error:', error);
    return res.status(500).json({
      error: 'Unable to load withdrawals.',
    });
  }
});

router.get('/packages', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id::text AS id,
         name,
         price::text AS price,
         daily_return::text AS daily,
         duration_days AS duration,
         description
       FROM investment_packages
       WHERE is_active = TRUE
       ORDER BY price ASC`
    );

    return res.json({
      packages: result.rows,
      source: 'database',
    });
  } catch (error) {
    console.error('Finance packages error:', error);
    return res.status(500).json({
      error: 'Unable to load packages.',
    });
  }
});

/* GET /api/finance/my-packages
   Returns only packages owned by the authenticated member. */
router.get('/my-packages', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         up.id::text AS subscription_id,
         ip.id::text AS package_id,
         ip.name,
         up.purchase_amount::text AS price,
         ip.daily_return::text AS daily,
         ip.duration_days AS duration,
         ip.description,
         up.status,
         up.started_at,
         up.expires_at,
         up.created_at
       FROM user_packages up
       JOIN investment_packages ip
         ON ip.id = up.package_id
       WHERE up.user_id = $1
       ORDER BY up.created_at DESC`,
      [req.user.id]
    );

    return res.json({
      packages: result.rows,
      source: 'database',
    });
  } catch (error) {
    console.error('My packages error:', error);

    return res.status(500).json({
      error: 'Unable to load your packages.',
    });
  }
});


router.get('/referrals', requireAuth, async (req, res) => {
  try {
    const memberResult = await pool.query(
      `SELECT referral_code
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [req.user.id]
    );

    if (!memberResult.rowCount) {
      return res.status(404).json({
        error: 'Member account not found.',
      });
    }

    const referralCode = memberResult.rows[0].referral_code;

    const statsResult = await pool.query(
      `SELECT
         COUNT(*)::int AS total_referrals,
         COUNT(*) FILTER (
           WHERE email_verified = TRUE
         )::int AS verified_referrals
       FROM users
       WHERE referred_by = $1`,
      [req.user.id]
    );

    const referralsResult = await pool.query(
      `SELECT
         u.id,
         u.full_name AS "fullName",
         u.email,
         u.email_verified AS "emailVerified",
         u.created_at AS "joinedAt",
         latest.package_name AS "packageName",
         latest.package_status AS "packageStatus",
         latest.purchase_amount AS "purchaseAmount",
         latest.started_at AS "packageStartedAt",
         latest.expires_at AS "packageExpiresAt"
       FROM users u
       LEFT JOIN LATERAL (
         SELECT
           ip.name AS package_name,
           up.status AS package_status,
           up.purchase_amount,
           up.started_at,
           up.expires_at
         FROM user_packages up
         LEFT JOIN investment_packages ip
           ON ip.id = up.package_id
         WHERE up.user_id = u.id
         ORDER BY
           COALESCE(up.updated_at, up.created_at) DESC,
           up.id DESC
         LIMIT 1
       ) latest ON TRUE
       WHERE u.referred_by = $1
       ORDER BY u.created_at DESC`,
      [req.user.id]
    );

    const frontendUrl = (
      process.env.FRONTEND_URL ||
      'https://investmentplus.vercel.app'
    ).replace(/\/+$/, '');

    return res.json({
      referralCode,
      referralLink: referralCode
        ? `${frontendUrl}/register?ref=${encodeURIComponent(referralCode)}`
        : null,
      totalReferrals: statsResult.rows[0].total_referrals,
      verifiedReferrals: statsResult.rows[0].verified_referrals,
      referrals: referralsResult.rows,
      commissions: null,
      commissionStatus: 'not_implemented',
      source: 'database',
    });
  } catch (error) {
    console.error('Referral dashboard error:', error);

    return res.status(500).json({
      error: 'Unable to load referral information.',
    });
  }
});


module.exports = router;
