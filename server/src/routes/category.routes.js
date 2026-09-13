import { Router } from 'express';
import * as controller from '../controllers/catalog.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createCategorySchema, updateCategorySchema } from '../validators/schemas.js';

export const categoryRouter = Router();
categoryRouter.get('/', asyncHandler(controller.listCategories));
categoryRouter.get('/admin/all', authenticate, authorize('admin'), asyncHandler(controller.listAllCategories));
categoryRouter.get('/:identifier', asyncHandler(controller.getCategory));
categoryRouter.post('/', authenticate, authorize('admin'), validate(createCategorySchema), asyncHandler(controller.createCategory));
categoryRouter.patch('/:id', authenticate, authorize('admin'), validate(updateCategorySchema), asyncHandler(controller.updateCategory));
categoryRouter.delete('/:id', authenticate, authorize('admin'), asyncHandler(controller.removeCategory));
