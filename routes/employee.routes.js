const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/database");

// GET all employees
router.get("/", async (req, res) => {
  try {
    const db = getDatabase();
    const employees = await db.collection("employees").find().toArray();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to get employees", error: err });
  }
});

// GET employee by ID
router.get("/:id", async (req, res) => {
  const db = getDatabase();
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid employee ID" });
  }

  try {
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(id) });
    if (!employee) return res.status(404).json({ message: "❌ Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "❌ Error retrieving employee", error: err });
  }
});

// POST new employee
router.post("/", async (req, res) => {
  const { firstName, lastName, departmentId, jobTitle, salary, email } = req.body;
  const db = getDatabase();

  if (!firstName || !lastName || !departmentId || !jobTitle || salary === undefined || !email) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  try {
    const existing = await db.collection("employees").findOne({ email });
    if (existing) return res.status(400).json({ message: "❌ Email already exists" });

    const newEmployee = { firstName, lastName, departmentId, jobTitle, salary, email };
    const result = await db.collection("employees").insertOne(newEmployee);
    res.status(201).json({ message: "✅ Employee created", employee: { ...newEmployee, _id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to create employee", error: err });
  }
});

// ✅ PUT update employee by ID
router.put("/:id", async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid employee ID" });
  }

  const updatedEmployee = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    departmentId: req.body.departmentId,
    jobTitle: req.body.jobTitle,
    salary: req.body.salary,
    email: req.body.email
  };

  try {
    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEmployee }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "❌ Employee not found" });
    }

    res.status(200).json({ message: "✅ Employee updated successfully" });
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "❌ Error updating employee", error });
  }
});

module.exports = router;
