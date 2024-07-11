// Simulates our users database table
const usersDB = {
  // This will be the users
  users: require("../model/users.json"),
  // This is how to set the users. Similar to using state
  setUsers: function (data) {
    this.users = data;
  },
};

// These are here to access the mock json database
const fsPromises = require("fs").promises;
const path = require("path");

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
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    // If we dont have a found user but do have a cookie at this point THEN clear the cookie
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); // Successful but no content
  }

  // IF we reach this point THEN we have found a user with the refreshToken and need to DELETE it in the DB.

  // OtherUSers is all other users that don't match the current foundUsers refreshToken
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  // The current user is being updated with a blank refreshToken
  const currentUser = { ...foundUser, refreshToken: "" };
  // Updating the users.json file
  usersDB.setUsers([...otherUsers, currentUser]);
  // Writing to the users.json file
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  // Clearing the cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204); // All is good but have no content to send back
};
// Export as an object
module.exports = { handleLogout };
