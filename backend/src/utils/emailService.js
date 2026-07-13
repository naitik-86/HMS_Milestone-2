const nodemailer = require('nodemailer');

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const sendEmail = async (options) => {
  try {
    const smtpEmail = process.env.SMTP_EMAIL || process.env.MAIL_USER;
    const smtpPassword = process.env.SMTP_PASSWORD || process.env.MAIL_APP_PASSWORD;
    const recipientEmail = typeof options?.email === 'string'
      ? options.email.trim()
      : options?.email;

    // Fail fast with a clear error if SMTP is misconfigured.
    const smtpHost = getRequiredEnv('SMTP_HOST');
    const smtpPortRaw = getRequiredEnv('SMTP_PORT');
    const smtpPort = Number(smtpPortRaw);

    if (!smtpEmail || !smtpPassword) {
      throw new Error(
        'Missing SMTP credentials. Set SMTP_EMAIL/MAIL_USER and SMTP_PASSWORD/MAIL_APP_PASSWORD in .env'
      );
    }

    if (!recipientEmail) {
      throw new Error('Missing recipient email');
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    // Connectivity check (helps when env is wrong / blocked). Only logs.
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error('SMTP verify failed:', {
        error: verifyErr.message,
        smtpHost,
        smtpPort,
      });
      // Continue to try sendMail; some providers behave differently.
    }

    // Fallback for FROM_EMAIL added just in case .env is missing it
    const fromEmail = process.env.FROM_EMAIL || smtpEmail;
    const fromName = process.env.FROM_NAME || 'PAHMS Support';

    const message = {
      from: `${fromName} <${fromEmail}>`,
      to: recipientEmail,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent:', { to: recipientEmail, messageId: info.messageId });
    return info;
  } catch (err) {
    // Add enough context to debug without exposing passwords.
    console.error('Email send failed:', {
      to: options?.email,
      subject: options?.subject,
      error: err.message,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      hasSMTP_EMAIL: Boolean(process.env.SMTP_EMAIL || process.env.MAIL_USER),
      hasSMTP_PASSWORD: Boolean(process.env.SMTP_PASSWORD || process.env.MAIL_APP_PASSWORD),
      fromEmailConfigured: Boolean(process.env.FROM_EMAIL),
    });
    throw err;
  }
};

module.exports = sendEmail;


