const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRepuestos = async (req, res) => {
  try {
    const repuestos = await prisma.repuesto.findMany();
    res.json(repuestos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRepuesto = async (req, res) => {
  const { nombre, stock, codigo, descripcion, precio, proveedor, ubicacion, categoria } = req.body;
  try {
    const data = { 
      nombre, 
      stock: Number(stock),
      codigo: codigo || null,
      descripcion: descripcion || null,
      precio: precio ? Number(precio) : null,
      proveedor: proveedor || null,
      ubicacion: ubicacion || null,
      categoria: categoria || null
    };

    const repuesto = await prisma.repuesto.create({ data });
    res.status(201).json(repuesto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateRepuesto = async (req, res) => {
  const { id } = req.params;
  const { nombre, stock, codigo, descripcion, precio, proveedor, ubicacion, categoria } = req.body;
  try {
    const data = { 
      nombre, 
      stock: Number(stock),
      codigo: codigo || null,
      descripcion: descripcion || null,
      precio: precio ? Number(precio) : null,
      proveedor: proveedor || null,
      ubicacion: ubicacion || null,
      categoria: categoria || null
    };

    const repuesto = await prisma.repuesto.update({
      where: { id: Number(id) },
      data
    });
    res.json(repuesto);
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Repuesto no encontrado' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.deleteRepuesto = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.repuesto.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Repuesto eliminado' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Repuesto no encontrado' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};
