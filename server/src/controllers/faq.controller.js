import * as service from '../services/faq.service.js';

export async function list(req, res) { res.json({ success: true, data: await service.listFaqs(false) }); }
export async function listAll(req, res) { res.json({ success: true, data: await service.listFaqs(true) }); }
export async function create(req, res) { res.status(201).json({ success: true, data: await service.createFaq(req.validated.body) }); }
export async function update(req, res) { res.json({ success: true, data: await service.updateFaq(req.params.id, req.validated.body) }); }
export async function remove(req, res) { await service.removeFaq(req.params.id); res.status(204).send(); }
