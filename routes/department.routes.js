const express = require("express");
const router = express.Router();

let departments = [];

router.get("/", (req, res) => {
  res.status(200).json({ departments });
});

router.post("/", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: "❌ Missing required fields: name and description" });
  }
  const newDepartment = { id: departments.length + 1, name, description };
  departments.push(newDepartment);
  res.status(201).json({ message: "✅ Department created", department: newDepartment });
});

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = departments.findIndex(dep => dep.id === id);
  if (index === -1) return res.status(404).json({ message: "❌ Department not found" });
  const deleted = departments.splice(index, 1);
  res.status(200).json({ message: "✅ Department deleted", department: deleted[0] });
});

module.exports = router;
