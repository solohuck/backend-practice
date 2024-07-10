// Importing core modules
const path = require("path"); // Module for handling and transforming file paths
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const app = express();
const { logger } = require("./middleware/logEvents");
const errorhandler = require("./middleware/errorHandler");

// Setting the port number, either from environment variables or default to 3500
const PORT = process.env.PORT || 3500;

// Custom middleware logger
app.use(logger);

// Cross origin resource sharing
app.use(cors(corsOptions));

// Built-in middleware to handle urlendocded data (form data)
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json
app.use(express.json());

// Built-in middleware to serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
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

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
