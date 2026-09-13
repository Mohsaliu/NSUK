import * as service from '../services/favorite.service.js';

export async function list(req, res) { res.json({ success: true, data: await service.listFavorites(req.user.id) }); }
export async function add(req, res) { res.status(201).json({ success: true, data: await service.addFavorite(req.user.id, req.params.productId) }); }
export async function remove(req, res) { await service.removeFavorite(req.user.id, req.params.productId); res.status(204).send(); }
