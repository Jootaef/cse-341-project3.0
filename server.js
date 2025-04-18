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

// Passport OAuth config
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
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

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(bodyParser.json());

// Routes
app.use("/", mainRouter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(require("./swagger.json")));

// MongoDB connection and server startup
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
