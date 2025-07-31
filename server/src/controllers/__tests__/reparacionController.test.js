const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/reparaciones', require('../../routes/reparaciones'));

jest.mock('../../middleware/auth', () => (req, res, next) => next());

describe('Reparaciones Endpoints', () => {
  it('should create a new reparacion', async () => {
    const res = await request(app)
      .post('/api/reparaciones')
      .send({ fecha: new Date().toISOString(), maquinariaId: 1, descripcion: 'Cambio de filtro', repuestos: [{ repuestoId: 1, cantidad: 2 }] });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get all reparaciones', async () => {
    const res = await request(app)
      .get('/api/reparaciones');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
