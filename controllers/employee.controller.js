const { ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");
const db = require("../db/database");

const getAllEmployees = async (req, res) => {
  try {
    const result = await db.getDatabase().collection("employees").find().toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve employees", error });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const empId = new ObjectId(req.params.id);
    const result = await db.getDatabase().collection("employees").findOne({ _id: empId });
    if (!result) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve employee", error });
  }
};

const createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, departmentId, jobTitle, salary, email } = req.body;

  // Verificar si el campo email no está vacío ni nulo
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "❌ Email is required and cannot be empty" });
  }

  // Crear el nuevo empleado
  const newEmployee = {
    firstName,
    lastName,
    departmentId,
    jobTitle,
    salary,
    email, // Asegurarse de que email esté presente
  };

  try {
    // Verificar si el email ya existe en la base de datos (duplicado)
    const existingEmployee = await db.getDatabase().collection("employees").findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "❌ Email is already in use" });
    }

    // Insertar el nuevo empleado
    const response = await db.getDatabase().collection("employees").insertOne(newEmployee);
    res.status(201).json({ message: "Employee created", id: response.insertedId });
  } catch (error) {
    console.error("❌ Error creating employee:", error);
    res.status(500).json({ message: "Failed to create employee", error });
  }
};

const updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, departmentId, jobTitle, salary, email } = req.body;

  // Verificar si el campo email no está vacío ni nulo
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "❌ Email is required and cannot be empty" });
  }

  const updatedEmployee = {
    firstName,
    lastName,
    departmentId,
    jobTitle,
    salary,
    email,  // Se asegura de que el email esté presente
  };

  try {
    const empId = new ObjectId(req.params.id);

    // Verificar si el email ya está siendo utilizado por otro empleado (exclusivo)
    const existingEmployee = await db.getDatabase().collection("employees").findOne({ email });
    
    // Permitir que el propio empleado actualice su email, incluso si ya existe un email duplicado
    if (existingEmployee && existingEmployee._id.toString() !== empId.toString()) {
      return res.status(400).json({ message: "❌ Email is already in use by another employee" });
    }

    const result = await db.getDatabase().collection("employees").replaceOne({ _id: empId }, updatedEmployee);
    if (result.modifiedCount === 0) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee updated" });
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "Failed to update employee", error });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const empId = new ObjectId(req.params.id);
    const result = await db.getDatabase().collection("employees").deleteOne({ _id: empId });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete employee", error });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
