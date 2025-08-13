// Módulo: Auth Controller
// Rol: registro y login de usuarios (JWT)
// Contratos: register -> 201/200 si existe; login -> 200 con token | 401 inválidas

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

function issueDevToken(res) {
  const token = jwt.sign({ userId: 0, role: 'Admin', dev: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return res.json({ token, bypass: true });
}

function tryDevBypass(username, password, res) {
  const devUser = process.env.DEV_USER || 'admin';
  const devPass = process.env.DEV_PASS || 'admin';
  if (username === devUser && password === devPass) {
    return issueDevToken(res);
  }
  return res.status(401).json({ error: 'Credenciales inválidas (DEV_BYPASS_AUTH activo)' });
}

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Verificar si el usuario ya existe
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(200).json({ error: 'Usuario ya existe', id: existing.id });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role }
    });
    res.status(201).json({ message: 'Usuario creado', id: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
  // Bypass opcional para trabajar sin DB (solo si DEV_BYPASS_AUTH=true)
  if (String(process.env.DEV_BYPASS_AUTH).toLowerCase() === 'true') {
      return tryDevBypass(username, password, res);
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    // Fallback automático en desarrollo si la DB está caída
    const isDev = (process.env.NODE_ENV || 'development') === 'development';
    const allowFallback = String(process.env.ALLOW_DEV_FALLBACK || 'true').toLowerCase() !== 'false';
    const unreachable = (err && (err.code === 'P1001' || /Can't reach database server/i.test(err.message)));
    if (isDev && allowFallback && unreachable) {
      return tryDevBypass(username, password, res);
    }
    res.status(400).json({ error: err.message });
  }
};
