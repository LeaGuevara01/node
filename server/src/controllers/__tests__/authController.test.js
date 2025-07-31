const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/auth', require('../../routes/auth'));

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass', role: 'admin' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
  });

  it('should login with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser2', password: 'testpass2', role: 'user' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser2', password: 'testpass2' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
