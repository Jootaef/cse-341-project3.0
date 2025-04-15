const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const mongodb = require("./db/database");
const mainRouter = require("./routes/index");

const port = process.env.PORT || 3000;

// Define la configuración de Swagger
const doc = {
  info: {
    title: 'Inventory API',
    description: 'This documentation describes the available endpoints for managing employees and departments.',
    version: "1.0.0"
  },
  host: 'localhost:3000',
  basePath: "/",
  schemes: ['http']
};

const app = express();

// Middleware
app
  .use(bodyParser.json())  // Middleware para analizar el cuerpo de las solicitudes JSON
  .use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] })) // Configuración CORS
  .use("/", mainRouter); // Rutas principales

// Rutas de Swagger (asegurarse de servir la documentación en /api-docs)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(require("./swagger.json")));

// Inicializa la base de datos
mongodb.initDb((err) => {
  if (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  } else {
    console.log(`✅ MongoDB connected - Server running on port ${port}`);
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`🚀 Web server running at http://localhost:${port}`);
});

module.exports = app;
