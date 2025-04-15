const Employee = require('../models/employee.model');

exports.getAllEmployees = async (req, res) => {
  const employees = await Employee.find().populate('departmentId');
  res.json(employees);
};

exports.getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).send('Employee not found');
  res.json(employee);
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
