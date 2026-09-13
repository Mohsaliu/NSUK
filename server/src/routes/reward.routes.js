import { Router } from 'express';
import * as controller from '../controllers/reward.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRewardSchema, updateRewardSchema } from '../validators/schemas.js';

export const rewardRouter = Router();
rewardRouter.get('/', asyncHandler(controller.list));
rewardRouter.use(authenticate);
rewardRouter.get('/me/redemptions', asyncHandler(controller.redemptions));
rewardRouter.post('/:id/redeem', asyncHandler(controller.redeem));
rewardRouter.post('/', authorize('admin'), validate(createRewardSchema), asyncHandler(controller.create));
rewardRouter.patch('/:id', authorize('admin'), validate(updateRewardSchema), asyncHandler(controller.update));
rewardRouter.delete('/:id', authorize('admin'), asyncHandler(controller.remove));
