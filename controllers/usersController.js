const mongodb = require("../db/database");
const { ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDatabase();
    const users = await db.collection("users").find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error in getAll:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error in getSingle:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve user", error: error.message });
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const db = mongodb.getDatabase();
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };
    const result = await db.collection("users").insertOne(user);
    res.status(201).json({ message: "User created", id: result.insertedId });
  } catch (error) {
    console.error("❌ Error in createUser:", error);
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };
    const result = await db
      .collection("users")
      .replaceOne({ _id: userId }, user);
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("❌ Error in updateUser:", error);
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  console.log("📣 Delete user requested:", req.params.id);
  console.log(
    "- Session user:",
    req.session?.user?.username || req.session?.user?.displayName
  );

  try {
    const userId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const result = await db.collection("users").deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      console.log("❌ User not found for deletion");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ User deleted successfully");
    res.status(204).send();
  } catch (error) {
    console.error("❌ Error in deleteUser:", error);
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
