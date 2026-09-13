import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { seedDatabase } from '../src/seeds/seed.js';

let mongo;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDatabase(mongo.getUri());
  await seedDatabase();
});

after(async () => {
  await disconnectDatabase();
  await mongo.stop();
});

test('health endpoint reports a connected database', async () => {
  const response = await request(app).get('/health').expect(200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.database, 'connected');
});

test('public catalog is seeded from the frontend catalog', async () => {
  const response = await request(app).get('/api/v1/stores?limit=10').expect(200);
  assert.equal(response.body.data.items.length, 6);
  assert.equal(response.body.data.items.some((store) => store.slug === 'mama-cass-bukka'), true);
  const products = await request(app).get('/api/v1/products?limit=1').expect(200);
  assert.equal(products.body.data.meta.total >= 50, true);
});

test('reward claims issue a one-use account-scoped promo', async () => {
  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ identifier: 'leonard@nsuk.edu.ng', password: 'Student123!' })
    .expect(200);
  const auth = { Authorization: `Bearer ${login.body.data.accessToken}` };
  const rewards = await request(app).get('/api/v1/rewards').expect(200);
  const discountReward = rewards.body.data.find((reward) => reward.name === '₦500 Off Delivery');
  const claim = await request(app).post(`/api/v1/rewards/${discountReward._id}/redeem`).set(auth).expect(201);
  assert.match(claim.body.data.claimedPromo.code, /^RWD-/);

  const products = await request(app).get('/api/v1/products?sort=price_desc&limit=1').expect(200);
  await request(app)
    .post('/api/v1/cart/items')
    .set(auth)
    .send({ productId: products.body.data.items[0]._id, quantity: 1 })
    .expect(201);
  const cart = await request(app)
    .post('/api/v1/cart/promo')
    .set(auth)
    .send({ code: claim.body.data.claimedPromo.code })
    .expect(200);
  assert.equal(cart.body.data.discount, 500);
  await request(app).post(`/api/v1/rewards/${discountReward._id}/redeem`).set(auth).expect(409);
});

test('customer can register, build a cart, order, and complete a mock payment', async () => {
  const registration = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Test Student', username: 'teststudent', email: 'test@nsuk.edu.ng', password: 'Testpass123' })
    .expect(201);
  const token = registration.body.data.accessToken;
  const auth = { Authorization: `Bearer ${token}` };

  const address = await request(app)
    .post('/api/v1/addresses')
    .set(auth)
    .send({ label: 'Hostel', address: 'Block C, Room 10, NSUK Campus' })
    .expect(201);

  const products = await request(app).get('/api/v1/products?limit=1').expect(200);
  const productId = products.body.data.items[0]._id;
  const cart = await request(app)
    .post('/api/v1/cart/items')
    .set(auth)
    .send({ productId, quantity: 2 })
    .expect(201);
  assert.equal(cart.body.data.items[0].quantity, 2);

  const discounted = await request(app)
    .post('/api/v1/cart/promo')
    .set(auth)
    .send({ code: 'NSUKFRESH' })
    .expect(200);
  assert.equal(discounted.body.data.discount, 150);

  const order = await request(app)
    .post('/api/v1/orders')
    .set(auth)
    .send({ addressId: address.body.data._id, paymentMethod: 'card' })
    .expect(201);
  assert.equal(order.body.data.status, 'pending');
  assert.equal(order.body.data.discount, 150);

  const payment = await request(app)
    .post('/api/v1/payments/initialize')
    .set(auth)
    .send({ orderId: order.body.data._id })
    .expect(201);
  assert.equal(payment.body.data.status, 'successful');

  const fetchedOrder = await request(app)
    .get(`/api/v1/orders/${order.body.data._id}`)
    .set(auth)
    .expect(200);
  assert.equal(fetchedOrder.body.data.paymentStatus, 'paid');

  const adminLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ identifier: 'admin@droply.ng', password: 'Admin123!' })
    .expect(200);
  const adminAuth = { Authorization: `Bearer ${adminLogin.body.data.accessToken}` };
  const riders = await request(app).get('/api/v1/users?role=rider').set(adminAuth).expect(200);
  const riderId = riders.body.data.items[0]._id;
  await request(app)
    .patch(`/api/v1/orders/${order.body.data._id}/rider`)
    .set(adminAuth)
    .send({ riderId })
    .expect(200);

  await request(app)
    .post(`/api/v1/orders/${order.body.data._id}/messages`)
    .set(auth)
    .send({ message: 'Please call when you reach the hostel gate.' })
    .expect(201);

  for (const status of ['confirmed', 'preparing', 'ready_for_pickup']) {
    await request(app)
      .patch(`/api/v1/orders/${order.body.data._id}/status`)
      .set(adminAuth)
      .send({ status })
      .expect(200);
  }

  const riderLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ identifier: 'rider@droply.ng', password: 'Rider123!' })
    .expect(200);
  const riderAuth = { Authorization: `Bearer ${riderLogin.body.data.accessToken}` };
  const messages = await request(app)
    .get(`/api/v1/orders/${order.body.data._id}/messages`)
    .set(riderAuth)
    .expect(200);
  assert.equal(messages.body.data.length, 1);

  for (const status of ['on_the_way', 'delivered']) {
    await request(app)
      .patch(`/api/v1/orders/${order.body.data._id}/status`)
      .set(riderAuth)
      .send({ status })
      .expect(200);
  }

  const profile = await request(app).get('/api/v1/users/me').set(auth).expect(200);
  assert.equal(profile.body.data.rewardPoints > 0, true);

  const reordered = await request(app)
    .post(`/api/v1/orders/${order.body.data._id}/reorder`)
    .set(auth)
    .expect(200);
  assert.equal(reordered.body.data.cart.items.length, 1);

  const refund = await request(app)
    .post(`/api/v1/payments/${payment.body.data.reference}/refund`)
    .set(adminAuth)
    .send({ reason: 'Integration test refund' });
  assert.equal(refund.status, 200, JSON.stringify(refund.body));
  const refundedProfile = await request(app).get('/api/v1/users/me').set(auth).expect(200);
  assert.equal(refundedProfile.body.data.rewardPoints, 0);
});

test('invalid registration input is rejected consistently', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'X', username: 'x', email: 'not-an-email', password: 'short' })
    .expect(422);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, 'Validation failed');
});
