const express = require("express");

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION, Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

require("dotenv").config();

// App imports
const authRoutes = require("./src/routes/auth_route");
const userRoutes = require("./src/routes/users_route");
const organisationRoutes = require("./src/routes/organisation_route");
const globalErrorHandler = require("./src/controllers/error_controller");

const app = express();

app.use(express.json());

// Routes

/**
 * Auth routes
 */
app.use("/auth", authRoutes);

/**
 * User routes
 */
app.use("/api/users", userRoutes);

/**
 * Organisation routes
 */
app.use("/api/organisations", organisationRoutes);

// Catch All route
app.all("*", (req, res, next) => {
  next(new AppError(`Invalid Route or Method ${req.originalUrl}`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
