const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const mongodb = require("./db/database");
const mainRouter = require("./routes/index");
const session = require("express-session");
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware: Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware: Passport GitHub Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

// Middleware: CORS y JSON
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(bodyParser.json());

// GitHub OAuth Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/api-docs", session: true }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

// Estado de sesión
app.get("/", (req, res) => {
  res.send(
    req.session.user
      ? `✅ Logged in as ${req.session.user.username}`
      : "❌ Not logged in"
  );
});

// Rutas principales
app.use("/", mainRouter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(require("./swagger.json")));

// Inicia MongoDB y servidor
mongodb.initDb((err) => {
  if (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  } else {
    app.listen(port, () => {
      console.log("✅ MongoDB connected");
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  }
});

module.exports = app;
