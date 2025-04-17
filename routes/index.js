const express = require("express");
const router = express.Router();
const passport = require("passport");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas originales
router.use("/employees", require("./employee.routes"));
router.use("/departments", require("./department.routes"));

// 🔐 Nuevas rutas protegidas
router.use("/items", require("./items")); // ya protegido internamente
router.use("/users", require("./users")); // ya protegido internamente

// GitHub login
router.get("/login", passport.authenticate("github"));

// GitHub logout
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
