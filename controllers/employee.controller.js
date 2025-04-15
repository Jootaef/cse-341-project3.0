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

  const newEmployee = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    departmentId: req.body.departmentId,
    jobTitle: req.body.jobTitle,
    salary: req.body.salary
  };

  try {
    const response = await db.getDatabase().collection("employees").insertOne(newEmployee);
    res.status(201).json({ message: "Employee created", id: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create employee", error });
  }
};

const updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const updatedEmployee = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    departmentId: req.body.departmentId,
    jobTitle: req.body.jobTitle,
    salary: req.body.salary
  };

  try {
    const empId = new ObjectId(req.params.id);
    const result = await db.getDatabase().collection("employees").replaceOne({ _id: empId }, updatedEmployee);
    if (result.modifiedCount === 0) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee updated" });
  } catch (error) {
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
