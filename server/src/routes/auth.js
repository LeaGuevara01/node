// Rutas: Auth
// POST /login (público) — POST /register (admin sugerido)

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);

module.exports = router;
