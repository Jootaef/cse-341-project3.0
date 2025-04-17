const { ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");
const db = require("../db/database");

const getAll = async (req, res) => {
  try {
    const result = await db.getDatabase().collection("items").find().toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve items", error });
  }
};

const getSingle = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);
    const result = await db
      .getDatabase()
      .collection("items")
      .findOne({ _id: itemId });
    if (!result) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve item", error });
  }
};

const createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const newItem = {
    productType: req.body.productType,
    productBrand: req.body.productBrand,
    productName: req.body.productName,
    weightPerUnit: req.body.weightPerUnit,
    pricePerUnit: req.body.pricePerUnit,
    sellingPrice: req.body.sellingPrice,
    expirationDate: req.body.expirationDate,
  };

  try {
    const response = await db
      .getDatabase()
      .collection("items")
      .insertOne(newItem);
    res.status(201).json({ message: "Item created", id: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create item", error });
  }
};

const updateItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const updatedItem = {
    productType: req.body.productType,
    productBrand: req.body.productBrand,
    productName: req.body.productName,
    weightPerUnit: req.body.weightPerUnit,
    pricePerUnit: req.body.pricePerUnit,
    sellingPrice: req.body.sellingPrice,
    expirationDate: req.body.expirationDate,
  };

  try {
    const itemId = new ObjectId(req.params.id);
    const result = await db
      .getDatabase()
      .collection("items")
      .replaceOne({ _id: itemId }, updatedItem);
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);
    const result = await db
      .getDatabase()
      .collection("items")
      .deleteOne({ _id: itemId });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createItem,
  updateItem,
  deleteItem,
};
