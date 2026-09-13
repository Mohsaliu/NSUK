import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  void _next;
  let err = error;
  if (error instanceof mongoose.Error.CastError) err = new ApiError(400, 'Invalid resource identifier');
  if (error?.code === 11000) err = new ApiError(409, 'A resource with these details already exists', error.keyValue);
  if (error instanceof ZodError) err = new ApiError(422, 'Validation failed', error.flatten());

  const statusCode = err.statusCode || 500;
  const body = { success: false, message: statusCode === 500 ? 'Internal server error' : err.message };
  if (err.details) body.details = err.details;
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) body.stack = err.stack;
  res.status(statusCode).json(body);
}
