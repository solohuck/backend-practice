const fs = require("fs"); // Core module for file system operations
const fsPromises = require("fs").promises; // Promises-based version of the fs module for asynchronous file operations
const path = require("path"); // Core module for handling and transforming file paths
const { v4: uuid } = require("uuid"); // Importing the UUID library to generate unique identifiers
const { format } = require("date-fns"); // Importing date-fns for date formatting

// No npm installation needed for the core modules as they are built into Node.js

/**
 * Asynchronously logs events to a specified file.
 * @param {string} message - The message to log.
 * @param {string} logName - The name of the log file.
 */
const logEvents = async (message, logName) => {
  // Formatting the current date and time as 'YYYYMMDD\tHH:mm:ss'
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;

  // Creating a log entry with the date/time, a unique identifier, and the message
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  // Output the log item to the console (for debugging/monitoring purposes)
  console.log(logItem);

  try {
    // Check if the 'logs' directory exists
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      // If not, create the 'logs' directory
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    // Append the log item to the specified log file
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    // Log any errors that occur during the file operations
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method}, ${req.path}`);
  next();
};

// Export the logEvents function for use in other modules
module.exports = { logEvents, logger };
