import { Router } from 'express';
import * as controller from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { reviewSchema } from '../validators/schemas.js';

export const reviewRouter = Router();
reviewRouter.use(authenticate);
reviewRouter.post('/', validate(reviewSchema), asyncHandler(controller.create));
reviewRouter.delete('/:id', asyncHandler(controller.remove));
