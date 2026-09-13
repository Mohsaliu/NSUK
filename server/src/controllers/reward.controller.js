import * as service from '../services/reward.service.js';

export async function list(req, res) { res.json({ success: true, data: await service.listRewards() }); }
export async function redeem(req, res) { res.status(201).json({ success: true, data: await service.redeemReward(req.user.id, req.params.id) }); }
export async function redemptions(req, res) { res.json({ success: true, data: await service.listRedemptions(req.user.id) }); }
export async function create(req, res) { res.status(201).json({ success: true, data: await service.createReward(req.validated.body) }); }
export async function update(req, res) { res.json({ success: true, data: await service.updateReward(req.params.id, req.validated.body) }); }
export async function remove(req, res) { res.json({ success: true, data: await service.removeReward(req.params.id) }); }
