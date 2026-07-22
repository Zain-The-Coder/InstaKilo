import config from "../config/config.js";

/**
 * Send WhatsApp OTP message.
 * Supports Twilio API if configured, or logs OTP in console for local dev testing.
 *
 * @param {string} toPhoneNumber - Destination phone number (e.g., "+923001234567")
 * @param {string} otp - 6-digit OTP code
 */
export const sendWhatsAppOTP = async (toPhoneNumber, otp) => {
  const messageBody = `🔒 Your Instakilo Password Reset OTP is: *${otp}*\nThis OTP is valid for 10 minutes. Do not share it with anyone.`;

  // If Twilio credentials are configured in .env, send actual WhatsApp message
  if (config.twilio.accountSid && config.twilio.authToken && config.twilio.whatsappNumber) {
    try {
      // Dynamic import of twilio if installed
      const twilio = (await import("twilio")).default;
      const client = twilio(config.twilio.accountSid, config.twilio.authToken);

      const formattedTo = toPhoneNumber.startsWith("whatsapp:")
        ? toPhoneNumber
        : `whatsapp:${toPhoneNumber}`;

      const formattedFrom = config.twilio.whatsappNumber.startsWith("whatsapp:")
        ? config.twilio.whatsappNumber
        : `whatsapp:${config.twilio.whatsappNumber}`;

      await client.messages.create({
        body: messageBody,
        from: formattedFrom,
        to: formattedTo,
      });

      console.log(`✅ WhatsApp OTP sent successfully to ${toPhoneNumber}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send WhatsApp message via Twilio:", error.message);
      // Fallback log for development
      console.log(`📱 [DEV FALLBACK] WhatsApp OTP for ${toPhoneNumber}: ${otp}`);
      return true;
    }
  } else {
    // Dev fallback when Twilio keys are not set
    console.log(`📱 [DEV MODE] WhatsApp OTP for ${toPhoneNumber}: *${otp}*`);
    return true;
  }
};
