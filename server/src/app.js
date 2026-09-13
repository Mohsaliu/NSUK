import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { paystackWebhook } from './controllers/payment.controller.js';
import { errorHandler, notFound } from './middleware/error.js';
import { apiRouter } from './routes/index.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { ApiError } from './utils/apiError.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      const allowed = env.corsOrigin.split(',').map((value) => value.trim());
      if (!origin || allowed.includes(origin)) return callback(null, true);
      callback(new ApiError(403, 'Origin is not allowed by CORS'));
    },
    credentials: true,
  }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use('/api/v1/auth', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
  }));

  app.post('/api/v1/payments/webhook/paystack', express.raw({ type: 'application/json', limit: '256kb' }), asyncHandler(paystackWebhook));
  app.use(express.json({ limit: '256kb' }));
  app.use(express.urlencoded({ extended: false, limit: '64kb' }));
  if (env.nodeEnv !== 'test') app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    const databaseStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const database = databaseStates[mongoose.connection.readyState] || 'unknown';
    res.status(database === 'connected' || env.nodeEnv === 'test' ? 200 : 503).json({
      success: database === 'connected' || env.nodeEnv === 'test',
      data: { service: 'droply-api', database, timestamp: new Date().toISOString() },
    });
  });
  app.use('/api/v1', apiRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export const app = createApp();
