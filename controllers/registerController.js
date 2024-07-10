const usersDB = {
  // This will be the users
  users: require("../model/users.json"),
  // This is how to set the users. Similar to using state
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  // The request will have a user and a password.
  // This will destructure it from the request body
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are not found" });
  // Check for duplicate username in the database
  // 'usersDB.users' Will pull in the users
  // "find((person) => person.username === user);" Out of each person, does the username equal the username of the user that has been submitted
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409); // 409 = conflit
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store the new user
    const newUser = { username: user, password: hashedPwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    // Write to the json file
    await fsPromises.writeFile(
      // Pull in the directory name, Go up out of the current directory,
      // Then go down to the model directory, Then go ahead and write the users.json file.
      // This will overwrite any excisting file there.
      path.join(__dirname, "..", "model", "users.json"),
      // Specify the data we sending
      JSON.stringify(usersDB.users)
    );
    // log to the console to see all the users or the new user sent
    console.log(usersDB.users);
    res.status(201).json({ sucess: `New User ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message }); // 500 = internal server error
  }
};

// Put this in an object so we can pull in the full name of the controller when we import it
module.exports = { handleNewUser };
