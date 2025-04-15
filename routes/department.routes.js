const express = require("express");
const router = express.Router();

// Simulación de base de datos para departamentos
let departments = [];

// Crear un nuevo departamento
router.post("/", (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "❌ Missing required fields" });
  }

  const newDepartment = { name, description };
  departments.push(newDepartment);
  res.status(201).json({ message: "✅ Department created successfully", department: newDepartment });
});

// Obtener todos los departamentos
router.get("/", (req, res) => {
  res.status(200).json({ departments });
});

module.exports = router;
