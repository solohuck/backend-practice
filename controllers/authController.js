const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // If it finds someone it will return that value and if not then it will be false or undefined
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // Evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // Grab the roles we put in the users json file
    const roles = Object.values(foundUser.roles);

    // Define the accessToken
    // Use the username object as a payload
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      // add the access secret
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    // Define the refresh token
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      // add the refresh secret
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // TODO: Save the refresh token to the database //

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    console.log(result);

    // Send as a httpOnly cookie. This is not available to javascript
    // 'name of cookie', pass in refresh token, options: httpOnly is set to true, maxAge: 1 Day
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // Store the accessToken in memory. Do not store in localStorage
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};
// Export as an object
module.exports = { handleLogin };
