const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMaquinarias = async (req, res) => {
  try {
    const maquinarias = await prisma.maquinaria.findMany();
    res.json(maquinarias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMaquinaria = async (req, res) => {
  const { nombre, modelo, categoria, anio, numero_serie, descripcion, proveedor, ubicacion, estado } = req.body;
  try {
    const data = { 
      nombre, 
      modelo, 
      categoria,
      anio: anio ? Number(anio) : null,
      numero_serie: numero_serie || null,
      descripcion: descripcion || null,
      proveedor: proveedor || null,
      ubicacion: ubicacion || null,
      estado: estado || null
    };

    const maquinaria = await prisma.maquinaria.create({ data });
    res.status(201).json(maquinaria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMaquinaria = async (req, res) => {
  const { id } = req.params;
  const { nombre, modelo, categoria, anio, numero_serie, descripcion, proveedor, ubicacion, estado } = req.body;
  try {
    const data = { 
      nombre, 
      modelo, 
      categoria,
      anio: anio ? Number(anio) : null,
      numero_serie: numero_serie || null,
      descripcion: descripcion || null,
      proveedor: proveedor || null,
      ubicacion: ubicacion || null,
      estado: estado || null
    };

    const maquinaria = await prisma.maquinaria.update({
      where: { id: Number(id) },
      data
    });
    res.json(maquinaria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMaquinaria = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.maquinaria.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Maquinaria eliminada' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Maquinaria no encontrada' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};
