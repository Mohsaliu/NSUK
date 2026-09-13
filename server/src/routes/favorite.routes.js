import { Router } from 'express';
import * as controller from '../controllers/favorite.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const favoriteRouter = Router();
favoriteRouter.use(authenticate);
favoriteRouter.get('/', asyncHandler(controller.list));
favoriteRouter.put('/:productId', asyncHandler(controller.add));
favoriteRouter.delete('/:productId', asyncHandler(controller.remove));
