const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/proveedores', require('../../routes/proveedores'));

jest.mock('../../middleware/auth', () => (req, res, next) => next());

describe('Proveedores Endpoints', () => {
  it('should create a new proveedor', async () => {
    const res = await request(app).post('/api/proveedores').send({ nombre: 'AgroRepuestos S.A.' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get all proveedores', async () => {
    const res = await request(app).get('/api/proveedores');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
