import { Router } from 'express';
import * as controller from '../controllers/order.controller.js';
import * as messageController from '../controllers/message.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { assignRiderSchema, cancelOrderSchema, createOrderSchema, messageSchema, orderStatusSchema } from '../validators/schemas.js';

export const orderRouter = Router();
orderRouter.use(authenticate);
orderRouter.get('/', asyncHandler(controller.list));
orderRouter.post('/', authorize('customer'), validate(createOrderSchema), asyncHandler(controller.create));
orderRouter.get('/:id', asyncHandler(controller.get));
orderRouter.get('/:id/messages', asyncHandler(messageController.list));
orderRouter.post('/:id/messages', validate(messageSchema), asyncHandler(messageController.send));
orderRouter.post('/:id/reorder', authorize('customer'), asyncHandler(controller.reorder));
orderRouter.patch('/:id/cancel', authorize('customer'), validate(cancelOrderSchema), asyncHandler(controller.cancel));
orderRouter.patch('/:id/status', authorize('admin', 'merchant', 'rider'), validate(orderStatusSchema), asyncHandler(controller.updateStatus));
orderRouter.patch('/:id/rider', authorize('admin'), validate(assignRiderSchema), asyncHandler(controller.assignRider));
