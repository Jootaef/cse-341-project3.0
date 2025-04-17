const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const mongodb = require("./db/database");
const mainRouter = require("./routes/index");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(bodyParser.json());

// Rutas de la API
app.use("/", mainRouter);

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(require("./swagger.json")));

// Conexión a MongoDB
mongodb.initDb((err) => {
  if (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  } else {
    app.listen(port, () => {
      console.log(`✅ MongoDB connected`);
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  }
});

module.exports = app;
