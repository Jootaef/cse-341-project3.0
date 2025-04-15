const Department = require('../models/department.model');

exports.getAllDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};

exports.getDepartmentById = async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) return res.status(404).send('Department not found');
  res.json(department);
};

exports.createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
