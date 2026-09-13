import * as service from '../services/review.service.js';

export async function listProductReviews(req, res) { res.json({ success: true, data: await service.listProductReviews(req.params.productId, req.query) }); }
export async function create(req, res) { res.status(201).json({ success: true, data: await service.createReview(req.user.id, req.validated.body) }); }
export async function remove(req, res) { await service.removeReview(req.user.id, req.params.id, req.user.role === 'admin'); res.status(204).send(); }
