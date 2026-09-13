import { Router } from 'express';
import * as controller from '../controllers/faq.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createFaqSchema, updateFaqSchema } from '../validators/schemas.js';

export const faqRouter = Router();
faqRouter.get('/', asyncHandler(controller.list));
faqRouter.get('/admin/all', authenticate, authorize('admin'), asyncHandler(controller.listAll));
faqRouter.post('/', authenticate, authorize('admin'), validate(createFaqSchema), asyncHandler(controller.create));
faqRouter.patch('/:id', authenticate, authorize('admin'), validate(updateFaqSchema), asyncHandler(controller.update));
faqRouter.delete('/:id', authenticate, authorize('admin'), asyncHandler(controller.remove));
