import { Router } from 'express';
import * as controller from '../controllers/payment.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { initializePaymentSchema, refundPaymentSchema } from '../validators/schemas.js';

export const paymentRouter = Router();
paymentRouter.use(authenticate);
paymentRouter.get('/', asyncHandler(controller.list));
paymentRouter.post('/initialize', validate(initializePaymentSchema), asyncHandler(controller.initialize));
paymentRouter.get('/:reference/verify', asyncHandler(controller.verify));
paymentRouter.post('/:reference/refund', authorize('admin'), validate(refundPaymentSchema), asyncHandler(controller.refund));
