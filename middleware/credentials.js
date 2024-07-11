const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  // IF the origin sending the requet is in the allowedOrigins list
  if (allowedOrigins.includes(origin)) {
    // THEN set this header on the repsonse. CORS is is lookin for this response
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();  
};

module.exports = credentials;
