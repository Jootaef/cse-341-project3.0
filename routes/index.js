const express = require("express");
const router = express.Router();
const passport = require("passport");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Public API routes
router.use("/employees", require("./employee.routes"));
router.use("/departments", require("./department.routes"));

// Protected API routes
router.use("/items", require("./items")); // already uses isAuthenticated internally
router.use("/users", require("./users")); // already uses isAuthenticated internally

// GitHub OAuth login
router.get("/login", passport.authenticate("github"));

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/api-docs");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/api-docs");
  });
});

module.exports = router;
