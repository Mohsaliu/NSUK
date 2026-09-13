import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notificationSettingsSchema, profileSchema, userStatusSchema } from '../validators/schemas.js';

export const userRouter = Router();
userRouter.use(authenticate);
userRouter.get('/me', asyncHandler(controller.me));
userRouter.patch('/me', validate(profileSchema), asyncHandler(controller.updateMe));
userRouter.patch('/me/notification-settings', validate(notificationSettingsSchema), asyncHandler(controller.updateNotificationSettings));
userRouter.get('/', authorize('admin'), asyncHandler(controller.listUsers));
userRouter.patch('/:id/status', authorize('admin'), validate(userStatusSchema), asyncHandler(controller.setUserStatus));
