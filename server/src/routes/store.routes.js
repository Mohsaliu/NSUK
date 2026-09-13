import { Router } from 'express';
import * as controller from '../controllers/catalog.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createStoreSchema, updateStoreSchema } from '../validators/schemas.js';

export const storeRouter = Router();
storeRouter.get('/', asyncHandler(controller.listStores));
storeRouter.get('/:identifier', asyncHandler(controller.getStore));
storeRouter.post('/', authenticate, authorize('admin', 'merchant'), validate(createStoreSchema), asyncHandler(controller.createStore));
storeRouter.patch('/:id', authenticate, authorize('admin', 'merchant'), validate(updateStoreSchema), asyncHandler(controller.updateStore));
storeRouter.delete('/:id', authenticate, authorize('admin'), asyncHandler(controller.removeStore));
