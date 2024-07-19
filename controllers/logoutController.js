const User = require("../model/User");

// No async just request and response
const handleLogout = async (req, res) => {
  // TODO: On Client, also delete the accessToken in memory.

  // We will be looking for a cookie so define cookies with the req.cookies
  const cookies = req.cookies;
  // Make sure we have cookies. Use optional chaining "?."
  // IF we have cookies THEN we check for a JWT property "cookies.jwt"
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  // If it makes it to this point then we know a cookies is present
  // Define the refresh token with the vaules we have recieved
  const refreshToken = cookies.jwt;

  // Is the refresh token in the database?
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    // If we dont have a found user but do have a cookie at this point THEN clear the cookie
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); // Successful but no content
  }

  // IF we reach this point THEN we have found a user with the refreshToken and need to DELETE it in the DB.

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  // Clearing the cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204); // All is good but have no content to send back
};
// Export as an object
module.exports = { handleLogout };
