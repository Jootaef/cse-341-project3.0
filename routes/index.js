// routes/index.js
const express = require("express");
const router = express.Router();

// Swagger documentation route
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
router.use("/employees", require("./employee.routes"));
router.use("/departments", require("./department.routes"));

module.exports = router; // ✅ Esto debe exportar una función router
