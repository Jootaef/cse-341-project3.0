const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/database');

// Crear un nuevo empleado
router.post("/", async (req, res) => {
  const { firstName, lastName, departmentId, jobTitle, salary, email } = req.body;
  const db = getDatabase();
  
  // Verificar si los campos requeridos están presentes
  if (!firstName || !lastName || !departmentId || !jobTitle || salary === undefined || !email) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  try {
    const collection = db.collection('employees');

    // Verificar si el email ya existe
    const existingEmployee = await collection.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "❌ Email already in use" });
    }

    // Crear el nuevo empleado
    const newEmployee = { firstName, lastName, departmentId, jobTitle, salary, email };

    // Insertar el nuevo empleado en la colección
    const result = await collection.insertOne(newEmployee);

    // Devolver la respuesta con el empleado insertado
    res.status(201).json({ message: "✅ Employee created successfully", employee: { ...newEmployee, _id: result.insertedId } });
  } catch (error) {
    console.error("❌ Error creating employee:", error);
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
    console.error("❌ Error retrieving employees:", error);
    res.status(500).json({ message: "❌ Error retrieving employees", error });
  }
});

module.exports = router;
