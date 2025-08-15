const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/repuestos', require('../../routes/repuestos'));

jest.mock('../../middleware/auth', () => (req, res, next) => next());

describe('Repuestos Endpoints', () => {
  it('should create a new repuesto', async () => {
    const res = await request(app)
      .post('/api/repuestos')
      .send({ nombre: 'Filtro de aceite', stock: 10 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get all repuestos', async () => {
    const res = await request(app).get('/api/repuestos');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
