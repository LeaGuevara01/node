// Middleware: Auth JWT
// Rol: validar token Bearer, exponer req.user y flag req.isAdmin
// Notas: tolera "Bearer <token>" o token plano; clockTolerance=5s

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || '';
    const parts = authHeader.split(' ');
    // Acepta "Bearer <token>" o solo "<token>"
    const token = parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] : parts[0];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { clockTolerance: 5 });
    req.user = decoded;
    // Normaliza rol admin en diferentes capitalizaciones
    req.isAdmin = decoded.role === 'Admin' || decoded.role === 'ADMIN' || decoded.role === 'admin';
    return next();
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 401 : 403;
    return res.status(code).json({ error: 'Token inválido o expirado' });
  }
};
