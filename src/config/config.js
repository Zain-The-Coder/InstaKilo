import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret_instakilo_dev",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "1h",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret_instakilo_dev",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || "",
  },
};

const requiredVars = ["mongodbUri"];
for (const key of requiredVars) {
  if (!config[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
}

export default config;
