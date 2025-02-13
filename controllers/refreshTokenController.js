const User = require("../model/User");
const jwt = require("jsonwebtoken");

// No async just request and response
const handleRefreshToken = async (req, res) => {
  // We will be looking for a cookie so define cookies with the req.cookies
  const cookies = req.cookies;
  // Make sure we have cookies. Use optional chaining "?."
  // IF we have cookies THEN we check for a JWT property "cookies.jwt"
  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized
  // Log to the console to see what vaules we get
  console.log(cookies.jwt);
  // If it makes it to this point then we know a cookies is present
  // Define the refresh token with the vaules we have recieved
  const refreshToken = cookies.jwt;

  // We do want to find a user BUT we are now looking for a refreshToken attached to that user
  const foundUser = await User.findOne({ refreshToken }).exec();

  // IF no user found return a 403
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // Evaluate JWT

  jwt.verify(
    // Pass in the recived refresh token
    refreshToken,
    // validate the token with the secret
    process.env.REFRESH_TOKEN_SECRET,
    // call back function
    (err, decoded) => {
      // IF there is an error or the username does not equal the decoded username
      if (err || foundUser.username !== decoded.username)
        return res.sendStatus(403);
      // Define roles. Pass in the found user and the roles associated with that user
      const roles = Object.values(foundUser.roles);
      // Create a new access token to send because the refresh token has been verified
      const accessToken = jwt.sign(
        // Access token will have a username. The same username that was verified before

        {
          UserInfo: {
            username: decoded.username,
            roles: roles,
          },
        },

        // Validate the access token with the secret
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      // AFTER creating the access token THEN we need to send the access token
      res.json({ accessToken });
    }
  );
};
// Export as an object
module.exports = { handleRefreshToken };
