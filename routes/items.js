const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const { isAuthenticated } = require('../middleware/authenticate');

// Rutas GET públicas - sin autenticación
router.get('/', itemsController.getAll);
router.get('/:id', itemsController.getSingle);

// Rutas protegidas - requieren autenticación
router.post('/', isAuthenticated, itemsController.createItem);
router.put('/:id', isAuthenticated, itemsController.updateItem);
router.delete('/:id', isAuthenticated, itemsController.deleteItem);

module.exports = router;