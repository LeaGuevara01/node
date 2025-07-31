const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProveedores = async (req, res) => {
  try {
    const proveedores = await prisma.proveedor.findMany();
    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProveedor = async (req, res) => {
  const { nombre, cuit, telefono, email, direccion, web, productos } = req.body;
  try {
    const data = { 
      nombre,
      cuit: cuit || null,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      web: web || null,
      productos: productos || []
    };

    const proveedor = await prisma.proveedor.create({ data });
    res.status(201).json(proveedor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, cuit, telefono, email, direccion, web, productos } = req.body;
  try {
    const data = { 
      nombre,
      cuit: cuit || null,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      web: web || null,
      productos: productos || []
    };

    const proveedor = await prisma.proveedor.update({
      where: { id: Number(id) },
      data
    });
    res.json(proveedor);
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.deleteProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.proveedor.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Proveedor eliminado' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};
