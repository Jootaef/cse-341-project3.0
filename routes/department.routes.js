const express = require('express');
const router = express.Router();
const controller = require('../controllers/department.controller');

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get('/', controller.getAllDepartments);
router.get('/:id', controller.getDepartmentById);
router.post('/', controller.createDepartment);
router.put('/:id', controller.updateDepartment);
router.delete('/:id', controller.deleteDepartment);

module.exports = router;
