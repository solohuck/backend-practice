// Note: Additional checks are needed to determine if the HTTP method is POST or PUT for handling different request types appropriately.
// This is a basic, dynamic server capable of serving typical website files (HTML, CSS, JS) and some data files (JSON, images).
// For a more streamlined and efficient implementation, consider using Express.js, a web application framework for Node.js that simplifies many tasks.
// This server is built using only Node.js core modules without any additional frameworks.

// Importing core modules
const http = require("http"); // Module for creating the HTTP server
const path = require("path"); // Module for handling and transforming file paths
const fs = require("fs"); // Module for file system operations
const fsPromises = require("fs").promises; // Promises version of the fs module

// Importing custom module for logging events
const logEvents = require("./logEvents");

// Importing the EventEmitter class from the events module
const EventEmitter = require("events");

// Extending the EventEmitter class to create a custom emitter
class Emitter extends EventEmitter {}

// Initializing the custom event emitter
const myEmitter = new Emitter();
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName)); // Setting up a listener for log events

// Setting the port number, either from environment variables or default to 3500
const PORT = process.env.PORT || 3500;

// Function to serve files to the client
const serveFile = async (filePath, contentType, response) => {
  try {
    // Read the file data asynchronously
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf8" : ""
    );
    // Parse JSON data if the content type is application/json
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    // Set response headers and status code
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    // Send the response
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt"); // Log the error
    response.statusCode = 500; // Internal Server Error
    response.end(); // End the response
  }
};

// Creating the HTTP server
const server = http.createServer((req, res) => {
  console.log(req.url, req.method); // Log the request URL and method
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt"); // Emit log event

  // Extract the file extension from the request URL
  const extension = path.extname(req.url);

  // Determine the content type based on the file extension
  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  // Build the file path
  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  // Automatically add .html extension if not present and the URL doesn't end with a slash
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  // Check if the file exists
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // Serve the file if it exists
    serveFile(filePath, contentType, res);
  } else {
    // Handle redirects and 404 errors
    switch (path.parse(filePath).base) {
      case "old-page.html":
        // Redirect to new page
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        // Redirect to home page
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        // Serve a 404 response if the file is not found
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

// Start the server and listen on the specified port
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

