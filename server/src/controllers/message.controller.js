import * as service from '../services/message.service.js';

export async function list(req, res) { res.json({ success: true, data: await service.listMessages(req.user, req.params.id) }); }
export async function send(req, res) { res.status(201).json({ success: true, data: await service.sendMessage(req.user, req.params.id, req.validated.body.message) }); }
