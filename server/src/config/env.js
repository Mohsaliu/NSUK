import 'dotenv/config';

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/droply',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-before-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  paymentProvider: process.env.PAYMENT_PROVIDER || 'mock',
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || '',
});
