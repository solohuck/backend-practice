// Simulates our users database table
const usersDB = {
  // This will be the users
  users: require("../model/users.json"),
  // This is how to set the users. Similar to using state
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // If it finds someone it will return that value and if not then it will be false or undefined
  const foundUser = usersDB.users.find((person) => person.username === user);
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

    // Creates an array of the other users that are not logged in
    // For each person that we have we will compare their username to the foundUser.username
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    // Add the refresh token to be saved to the current user
    const currentUser = { ...foundUser, refreshToken };
    // Sets all the users again after updating the DB
    usersDB.setUsers([...otherUsers, currentUser]);
    // Write the new users file
    await fsPromises.writeFile(
      // The file path we are writing to
      path.join(__dirname, "..", "model", "users.json"),
      // This will wirte the new users file
      JSON.stringify(usersDB.users)
    );
    // Send both the access token and refresh token to the user

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
