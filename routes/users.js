const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { isAuthenticated } = require('../middleware/authenticate');

// Rutas GET públicas - sin autenticación
router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);

// Rutas protegidas - requieren autenticación
router.post('/', isAuthenticated, usersController.createUser);
router.put('/:id', isAuthenticated, usersController.updateUser);
router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;