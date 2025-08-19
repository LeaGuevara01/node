// componenteRoutes.js
// Rutas Express para el recurso Componente
const express = require('express');
const router = express.Router();
const componenteController = require('../controllers/componenteController');

router.get('/', componenteController.getComponentes);
router.get('/:id', componenteController.getComponenteById);
router.post('/', componenteController.createComponente);
router.put('/:id', componenteController.updateComponente);
router.delete('/:id', componenteController.deleteComponente);

module.exports = router;
