const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/database');

// Crear un nuevo empleado
router.post("/", async (req, res) => {
  const { firstName, lastName, departmentId, jobTitle, salary } = req.body;
  const db = getDatabase();
  
  try {
    const collection = db.collection('employees');
    const newEmployee = { firstName, lastName, departmentId, jobTitle, salary };
    
    // Insertar el nuevo empleado
    const result = await collection.insertOne(newEmployee);
    res.status(201).json({ message: "✅ Employee created successfully", employee: result.ops[0] });
  } catch (error) {
    res.status(500).json({ message: "❌ Error creating employee", error });
  }
});

// Obtener todos los empleados
router.get("/", async (req, res) => {
  const db = getDatabase();
  
  try {
    const collection = db.collection('employees');
    const employees = await collection.find().toArray();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "❌ Error retrieving employees", error });
  }
});

module.exports = router;
