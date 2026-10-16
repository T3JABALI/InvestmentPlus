
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

async function sendVerificationEmail({ to, token }) {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const frontendUrl =
    process.env.FRONTEND_URL || 'http://localhost:5173';

  const verificationUrl = new URL(
    '/verify-email',
    frontendUrl
  );

  verificationUrl.searchParams.set('token', token);
  verificationUrl.searchParams.set('email', to);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'InvestmentPlus <onboarding@resend.dev>',
    to: [to],
    subject: 'Verify your InvestmentPlus email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
        <h2>Welcome to InvestmentPlus</h2>
        <p>Please verify your email address to activate your account.</p>
        <p>
          <a href="${verificationUrl.toString()}"
             style="display:inline-block;padding:12px 20px;background:#14532d;color:#fff;text-decoration:none;border-radius:6px;">
            Verify my email
          </a>
        </p>
        <p>This verification link expires in 30 minutes and can only be used once.</p>
        <p>If you didn't create this account, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Resend email error:', error.message);
    throw new Error('Unable to send verification email.');
  }

  return data;
}

module.exports = { sendVerificationEmail };
