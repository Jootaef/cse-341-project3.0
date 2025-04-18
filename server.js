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

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport GitHub Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL, // ⚠️ DEBE COINCIDIR EXACTAMENTE con lo de GitHub
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

// CORS y body-parser
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(bodyParser.json());

// Rutas principales
app.use("/", mainRouter);

// Ruta para el login con GitHub
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback después del login con GitHub
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: true,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/"); // Redirige a donde quieras después del login
  }
);

// Estado actual de la sesión
app.get("/", (req, res) => {
  res.send(
    req.session.user
      ? `✅ Logged in as ${req.session.user.username}`
      : "❌ Not logged in"
  );
});

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(require("./swagger.json")));

// Inicia la conexión a Mongo y el servidor
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
