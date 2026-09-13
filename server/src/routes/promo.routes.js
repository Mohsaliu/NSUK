import { Router } from 'express';
import * as controller from '../controllers/promo.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createPromoSchema, promoValidationSchema, updatePromoSchema } from '../validators/schemas.js';

export const promoRouter = Router();
promoRouter.use(authenticate);
promoRouter.post('/validate', validate(promoValidationSchema), asyncHandler(controller.validate));
promoRouter.get('/', authorize('admin'), asyncHandler(controller.list));
promoRouter.post('/', authorize('admin'), validate(createPromoSchema), asyncHandler(controller.create));
promoRouter.patch('/:id', authorize('admin'), validate(updatePromoSchema), asyncHandler(controller.update));
promoRouter.delete('/:id', authorize('admin'), asyncHandler(controller.remove));
