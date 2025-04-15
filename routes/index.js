const express = require("express");
const router = express.Router();

// Rutas de Swagger
// Asegúrate de que esta ruta sirva correctamente el archivo swagger.json
router.use("/api-docs", require("swagger-ui-express").serve, require("swagger-ui-express").setup(require("../swagger.json")));

// Rutas de la API
// Aquí conectamos las subrutas de empleados y departamentos
router.use("/employees", require("./employee.routes"));
router.use("/departments", require("./department.routes"));

module.exports = router;
