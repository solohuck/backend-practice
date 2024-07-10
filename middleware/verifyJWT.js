const jwt = require('jsonwebtoken');
require('dotenv').config();

// middleware should have a request, response, and next.
const verifyJWT = (req, res, next) => {
  // define the auth header
  const authHeader = req.headers['authorization'];
  // Check if the auth header has been recieved 
  if (!authHeader) return res.sendStatus(401);
  // log the auth header
  console.log(authHeader); // Bearer Token
  // define the token and grab it from the auth header 
  const token = authHeader.split(' ')[1];
  // verify the token
  jwt.verify(
    // pass in the token first 
    token,
    // pull in the access token secret that will be used to verify with this middleware
    process.env.ACCESS_TOKEN_SECRET,
    // Call back that get an err and decoded info from the JWT
    (err, decoded) => {
      // If a recieved token is off then send a forbidden error
      if (err) return res.sendStatus(403); // invalid token
      // The username was passed into the JWT and that has now been decoded so it can be read now
      // set the user equal to decoded.username
      req.user = decoded.username;
      next()
    }
  )

}

module.exports = verifyJWT