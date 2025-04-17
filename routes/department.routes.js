const express = require("express");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/database");
const router = express.Router();

// 📄 GET - Retrieve all departments
router.get("/", async (req, res) => {
  try {
    const db = getDatabase();
    const departments = await db.collection("departments").find().toArray();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "❌ Error retrieving departments", error });
  }
});

// 🔍 GET - Retrieve a department by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid department ID" });
  }

  try {
    const db = getDatabase();
    const department = await db.collection("departments").findOne({ _id: new ObjectId(id) });

    if (!department) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: "❌ Error retrieving department", error });
  }
});

// ➕ POST - Create a new department
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "❌ Missing required fields: name and description" });
  }

  try {
    const db = getDatabase();
    const newDepartment = { name, description };
    const result = await db.collection("departments").insertOne(newDepartment);

    res.status(201).json({
      message: "✅ Department created successfully",
      department: { ...newDepartment, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Error creating department", error });
  }
});

// ✏️ PUT - Update a department by ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid department ID" });
  }

  if (!name || !description) {
    return res.status(400).json({ message: "❌ Both name and description are required" });
  }

  try {
    const db = getDatabase();
    const result = await db.collection("departments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    res.status(200).json({ message: "✅ Department updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating department", error });
  }
});

// 🗑️ DELETE - Delete a department by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid department ID" });
  }

  try {
    const db = getDatabase();
    const result = await db.collection("departments").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    res.status(200).json({ message: "✅ Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting department", error });
  }
});

module.exports = router;
