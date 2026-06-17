const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Support both env var sets:
  // 1) SMTP_EMAIL / SMTP_PASSWORD (existing)
  // 2) MAIL_USER / MAIL_APP_PASSWORD (requested)
  const smtpEmail = process.env.SMTP_EMAIL || process.env.MAIL_USER;
  const smtpPassword = process.env.SMTP_PASSWORD || process.env.MAIL_APP_PASSWORD;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });


  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;