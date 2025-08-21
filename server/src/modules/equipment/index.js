// Equipment Management Module
// Handles the complete equipment hierarchy: Machine → Section → Component → Part

const express = require('express');
const router = express.Router();

// Import controllers
const machineController = require('./controllers/machineController');
const sectionController = require('./controllers/sectionController');
const componentController = require('./controllers/componentController');
const partController = require('./controllers/partController');

// Import middleware
const auth = require('../../middleware/auth');
const validate = require('./middleware/validation');

// Machine routes
router.get('/machines', auth, machineController.getAll);
router.get('/machines/:id', auth, machineController.getById);
router.post('/machines', auth, validate.machine, machineController.create);
router.put('/machines/:id', auth, validate.machine, machineController.update);
router.delete('/machines/:id', auth, machineController.delete);

// Section routes
router.get('/sections', auth, sectionController.getAll);
router.get('/sections/:id', auth, sectionController.getById);
router.post('/sections', auth, validate.section, sectionController.create);
router.put('/sections/:id', auth, validate.section, sectionController.update);
router.delete('/sections/:id', auth, sectionController.delete);

// Component routes
router.get('/components', auth, componentController.getAll);
router.get('/components/:id', auth, componentController.getById);
router.post('/components', auth, validate.component, componentController.create);
router.put('/components/:id', auth, validate.component, componentController.update);
router.delete('/components/:id', auth, componentController.delete);

// Part routes
router.get('/parts', auth, partController.getAll);
router.get('/parts/:id', auth, partController.getById);
router.post('/parts', auth, validate.part, partController.create);
router.put('/parts/:id', auth, validate.part, partController.update);
router.delete('/parts/:id', auth, partController.delete);

// Hierarchical routes
router.get('/machines/:id/sections', auth, machineController.getSections);
router.get('/sections/:id/components', auth, sectionController.getComponents);
router.get('/components/:id/parts', auth, componentController.getParts);

module.exports = router;
