const express = require("express");
const router = express.Router();

// Simulación de base de datos para empleados (esto puede ser reemplazado por MongoDB)
let employees = [];

// Crear un nuevo empleado
router.post("/", (req, res) => {
  const { firstName, lastName, departmentId, jobTitle, salary } = req.body;

  if (!firstName || !lastName || !departmentId || !jobTitle || salary === undefined) {
    return res.status(400).json({ message: "❌ Missing required fields" });
  }

  const newEmployee = { firstName, lastName, departmentId, jobTitle, salary };
  employees.push(newEmployee);
  res.status(201).json({ message: "✅ Employee created successfully", employee: newEmployee });
});

// Obtener todos los empleados
router.get("/", (req, res) => {
  res.status(200).json({ employees });
});

module.exports = router;
