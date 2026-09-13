import { Router } from 'express';
import * as controller from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { addCartItemSchema, promoCodeSchema, updateCartItemSchema } from '../validators/schemas.js';

export const cartRouter = Router();
cartRouter.use(authenticate);
cartRouter.get('/', asyncHandler(controller.getCart));
cartRouter.post('/items', validate(addCartItemSchema), asyncHandler(controller.addItem));
cartRouter.patch('/items/:productId', validate(updateCartItemSchema), asyncHandler(controller.updateItem));
cartRouter.delete('/items/:productId', asyncHandler(controller.removeItem));
cartRouter.delete('/', asyncHandler(controller.clear));
cartRouter.post('/promo', validate(promoCodeSchema), asyncHandler(controller.applyPromo));
cartRouter.delete('/promo', asyncHandler(controller.removePromo));
