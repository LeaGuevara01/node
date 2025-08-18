// Rutas: Reparaciones
// GET / (lista con include), GET /:id, CRUD por id, POST /bulk (importación masiva)

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const auth = require('../middleware/auth');
const {
  getReparaciones,
  getReparacion,
  createReparacion,
  updateReparacion,
  deleteReparacion,
  getReparacionFilters,
  getReparacionFiltersSimple,
} = require('../controllers/reparacionController');

router.get('/', auth, getReparaciones);
router.get('/filtros', auth, getReparacionFilters);
router.get('/filtros-simple', auth, getReparacionFiltersSimple);
router.get('/:id', auth, getReparacion);

router.post(
  '/',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden crear reparaciones' });
    next();
  },
  createReparacion
);

router.put(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden editar reparaciones' });
    next();
  },
  updateReparacion
);

router.delete(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden eliminar reparaciones' });
    next();
  },
  deleteReparacion
);

// Importación masiva (bulk) de reparaciones
router.post('/bulk', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden importar reparaciones' });
    if (!req.file) return res.status(400).json({ error: 'Archivo no proporcionado' });

    // TODO: Parsear CSV/XLSX del buffer req.file.buffer y crear registros
    const filename = req.file.originalname || '';
    return res.status(200).json({ count: 0, filename });
  } catch (err) {
    console.error('Error en importación de reparaciones:', err);
    return res.status(500).json({ error: 'Error interno al importar reparaciones' });
  }
});

module.exports = router;
