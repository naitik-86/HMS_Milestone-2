const { generateOTP, sendSMS, sendWhatsApp } = require('./otpService');

/**
 * Generates OTPs for email + mobile and sends them.
 * Mobile sending uses SMS (WhatsApp code kept in otpService).
 */
async function sendOtpMultiChannel({
  email,
  mobile,
  otpEmail,
  otpMobile,
  emailSender,
  smsChannel = 'SMS',
}) {
  // send email otp
  await emailSender({
    email,
    subject: 'Your HMS Login OTP',
    message: `Your login OTP is ${otpEmail}. It is valid for 5 minutes.`,
  });

  // send mobile otp
  if (mobile) {
    if (smsChannel === 'WHATSAPP') {
      await sendWhatsApp(mobile, otpMobile);
    } else {
      await sendSMS(mobile, otpMobile);
    }
  }
}

function createOtpPair() {
  return {
    otpEmail: generateOTP(),
    otpMobile: generateOTP(),
  };
}

module.exports = { sendOtpMultiChannel, createOtpPair };

