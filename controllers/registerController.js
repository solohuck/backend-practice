const User = require("../model/User");
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
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // 409 = conflit
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // Create and store the new user to the data model.
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);

    res.status(201).json({ sucess: `New User ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message }); // 500 = internal server error
  }
};

// Put this in an object so we can pull in the full name of the controller when we import it
module.exports = { handleNewUser };
