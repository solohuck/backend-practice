// Importing core modules
require("dotenv").config();
const path = require("path"); // Module for handling and transforming file paths
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const app = express();
const { logger } = require("./middleware/logEvents");
const errorhandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConn");

// Setting the port number, either from environment variables or default to 3500
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);

// Cross origin resource sharing
app.use(cors(corsOptions));

// Built-in middleware to handle urlendocded data (form data)
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Built-in middleware to serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
// This needs to be before the verifyJWT BECAUSE that is what checks the access token
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// This works like a waterfall. Everything after this line will use the JWT middleware
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

// app.all is more for routing and will apply to all http methods at once
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Error handler middleware
app.use(errorhandler);

// We will only listen for request if we have successfully connected to MongoDB
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  // Start the server and listen on the specified port
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
