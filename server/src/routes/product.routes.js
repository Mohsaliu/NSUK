import { Router } from 'express';
import * as catalogController from '../controllers/catalog.controller.js';
import * as reviewController from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createProductSchema, updateProductSchema } from '../validators/schemas.js';

export const productRouter = Router();
productRouter.get('/', asyncHandler(catalogController.listProducts));
productRouter.get('/:productId/reviews', asyncHandler(reviewController.listProductReviews));
productRouter.get('/:id', asyncHandler(catalogController.getProduct));
productRouter.post('/', authenticate, authorize('admin', 'merchant'), validate(createProductSchema), asyncHandler(catalogController.createProduct));
productRouter.patch('/:id', authenticate, authorize('admin', 'merchant'), validate(updateProductSchema), asyncHandler(catalogController.updateProduct));
productRouter.delete('/:id', authenticate, authorize('admin', 'merchant'), asyncHandler(catalogController.removeProduct));
