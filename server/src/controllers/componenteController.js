// componenteController.js
// Controlador básico para el recurso Componente
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getComponentes = async (req, res) => {
  try {
    const componentes = await prisma.componente.findMany();
    res.json(componentes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener componentes' });
  }
};

exports.getComponenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const componente = await prisma.componente.findUnique({ where: { id: Number(id) } });
    if (!componente) return res.status(404).json({ error: 'No encontrado' });
    res.json(componente);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener componente' });
  }
};

exports.createComponente = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    const componente = await prisma.componente.create({
      data: { nombre, descripcion, estado },
    });
    res.status(201).json(componente);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear componente' });
  }
};

exports.updateComponente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    const componente = await prisma.componente.update({
      where: { id: Number(id) },
      data: { nombre, descripcion, estado },
    });
    res.json(componente);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar componente' });
  }
};

exports.deleteComponente = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.componente.delete({ where: { id: Number(id) } });
    res.json({ message: 'Componente eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar componente' });
  }
};
