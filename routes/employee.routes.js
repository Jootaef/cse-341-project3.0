const express = require('express');
const router = express.Router();
const controller = require('../controllers/employee.controller');

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get('/', controller.getAllEmployees);
router.get('/:id', controller.getEmployeeById);
router.post('/', controller.createEmployee);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
