import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { changePasswordSchema, loginSchema, registerSchema } from '../validators/schemas.js';

export const authRouter = Router();
authRouter.post('/register', validate(registerSchema), asyncHandler(controller.register));
authRouter.post('/login', validate(loginSchema), asyncHandler(controller.login));
authRouter.post('/logout', authenticate, asyncHandler(controller.logout));
authRouter.patch('/password', authenticate, validate(changePasswordSchema), asyncHandler(controller.changePassword));
