import * as service from '../services/catalog.service.js';

export async function listCategories(req, res) { res.json({ success: true, data: await service.listCategories(req.query) }); }
export async function listAllCategories(req, res) { res.json({ success: true, data: await service.listCategories({ includeInactive: 'true' }) }); }
export async function getCategory(req, res) { res.json({ success: true, data: await service.getCategory(req.params.identifier) }); }
export async function createCategory(req, res) { res.status(201).json({ success: true, data: await service.createCategory(req.validated.body) }); }
export async function updateCategory(req, res) { res.json({ success: true, data: await service.updateCategory(req.params.id, req.validated.body) }); }
export async function removeCategory(req, res) { await service.removeCategory(req.params.id); res.status(204).send(); }

export async function listStores(req, res) { res.json({ success: true, data: await service.listStores(req.query) }); }
export async function getStore(req, res) { res.json({ success: true, data: await service.getStore(req.params.identifier, req.query) }); }
export async function createStore(req, res) { res.status(201).json({ success: true, data: await service.createStore(req.validated.body, req.user) }); }
export async function updateStore(req, res) { res.json({ success: true, data: await service.updateStore(req.params.id, req.validated.body, req.user) }); }
export async function removeStore(req, res) { res.json({ success: true, data: await service.removeStore(req.params.id) }); }

export async function listProducts(req, res) { res.json({ success: true, data: await service.listProducts(req.query) }); }
export async function getProduct(req, res) { res.json({ success: true, data: await service.getProduct(req.params.id) }); }
export async function createProduct(req, res) { res.status(201).json({ success: true, data: await service.createProduct(req.validated.body, req.user) }); }
export async function updateProduct(req, res) { res.json({ success: true, data: await service.updateProduct(req.params.id, req.validated.body, req.user) }); }
export async function removeProduct(req, res) { res.json({ success: true, data: await service.removeProduct(req.params.id, req.user) }); }
