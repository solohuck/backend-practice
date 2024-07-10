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
    // Todo: Create JWT's
    res.json({ success: `User ${user} is logged in` });
  } else {
    res.sendStatus(401);
  }
}; 
// Export as an object
module.exports = { handleLogin };
