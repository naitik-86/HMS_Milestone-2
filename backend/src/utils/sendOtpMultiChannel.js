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
  const deliveryTasks = [
    emailSender({
      email,
      subject: 'Your HMS Login OTP',
      message: `Your login OTP is ${otpEmail}. It is valid for 5 minutes.`,
    }),
  ];

  if (mobile) {
    deliveryTasks.push(
      smsChannel === 'WHATSAPP'
        ? sendWhatsApp(mobile, otpMobile)
        : sendSMS(mobile, otpMobile)
    );
  }

  const results = await Promise.allSettled(deliveryTasks);
  const failures = results.filter((result) => result.status === 'rejected');

  if (failures.length) {
    const errorMessage = failures
      .map((result) => result.reason?.message || 'OTP delivery failed')
      .join(' | ');

    throw new Error(errorMessage);
  }
}

function createOtpPair() {
  const otp = generateOTP();
  return {
    // A login challenge has one code, delivered through both channels.
    otpEmail: otp,
    otpMobile: otp,
  };
}

module.exports = { sendOtpMultiChannel, createOtpPair };

