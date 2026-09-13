import { Router } from 'express';
import * as controller from '../controllers/address.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createAddressSchema, updateAddressSchema } from '../validators/schemas.js';

export const addressRouter = Router();
addressRouter.use(authenticate);
addressRouter.get('/', asyncHandler(controller.list));
addressRouter.post('/', validate(createAddressSchema), asyncHandler(controller.create));
addressRouter.patch('/:id', validate(updateAddressSchema), asyncHandler(controller.update));
addressRouter.patch('/:id/default', asyncHandler(controller.setDefault));
addressRouter.delete('/:id', asyncHandler(controller.remove));
