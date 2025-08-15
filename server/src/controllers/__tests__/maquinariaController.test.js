const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/maquinaria', require('../../routes/maquinaria'));

// Mock auth middleware for tests
jest.mock('../../middleware/auth', () => (req, res, next) => next());

describe('Maquinaria Endpoints', () => {
  it('should create a new maquinaria', async () => {
    const res = await request(app)
      .post('/api/maquinaria')
      .send({ nombre: 'Tractor', tipo: 'Agrícola', modelo: 'TX-100' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get all maquinarias', async () => {
    const res = await request(app).get('/api/maquinaria');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
