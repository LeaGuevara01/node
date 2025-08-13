// Módulo: User Controller
// Rol: administración de usuarios (listar, actualizar, eliminar)
// Notas: no retorna contraseñas; maneja errores Prisma (P2002/P2025)

const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

exports.createUser = async (req, res) => {
  try {
    const { username, password, role = 'User' } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'username y password son obligatorios' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, role },
      select: { id: true, username: true, role: true }
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'El nombre de usuario ya existe' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, username: true, role: true } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserFilters = async (req, res) => {
  try {
    const rolesRows = await prisma.user.findMany({
      distinct: ['role'],
      select: { role: true }
    });
    const roles = rolesRows.map(r => r.role).filter(Boolean);
    const total = await prisma.user.count();
    res.json({ roles, totalUsuarios: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, role, password } = req.body;
  
  try {
    const updateData = {
      username: username || undefined,
      role: role || undefined
    };

    // Only hash password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: { id: true, username: true, role: true }
    });
    
    res.json(user);
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'El nombre de usuario ya existe' });
    } else if (err.code === 'P2025') {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else if (err.code === 'P2003') {
      res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene reparaciones asociadas' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
