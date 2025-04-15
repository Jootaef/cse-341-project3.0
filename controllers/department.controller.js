const { ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");
const db = require("../db/database");

const getAllDepartments = async (req, res) => {
  try {
    const result = await db.getDatabase().collection("departments").find().toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve departments", error });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const deptId = new ObjectId(req.params.id);
    const result = await db.getDatabase().collection("departments").findOne({ _id: deptId });
    if (!result) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve department", error });
  }
};

const createDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const newDepartment = {
    name: req.body.name,
    description: req.body.description,
  };

  try {
    const response = await db.getDatabase().collection("departments").insertOne(newDepartment);
    res.status(201).json({ message: "Department created", id: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create department", error });
  }
};

const updateDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const updatedDepartment = {
    name: req.body.name,
    description: req.body.description,
  };

  try {
    const deptId = new ObjectId(req.params.id);
    const result = await db.getDatabase().collection("departments").replaceOne({ _id: deptId }, updatedDepartment);
    if (result.modifiedCount === 0) return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update department", error });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const deptId = new ObjectId(req.params.id);
    const result = await db.getDatabase().collection("departments").deleteOne({ _id: deptId });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete department", error });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
