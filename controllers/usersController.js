const User = require("../model/User");

// Get all users

const getUsers = async (req, res) => {
  const users = await User.find();
  // Check for req body info
  if (!users) {
    return res.status(204).json({ message: "No user found." });
  }

  res.json(users);
};

// Create new user
const postUser = async (req, res) => {
  if (!req?.body?.username || !req?.body?.roles || !req?.body?.password) {
    return res
      .status(400)
      .json({ message: "Username, role, and password info is required" });
  }

  try {
    const result = await User.create({
      username: req.body.username,
      roles: req.body.roles,
      password: req.body.password,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
};

// update user
const putUser = async (req, res) => {
  // check for user id in req
  if (!req?.body?.id) {
    return res.status(400).json({ message: "User ID parameter required" });
  }

  // find the user based off that ID found in the request
  const user = await User.findOne({ _id: req.body.id }).exec();

  if (!user) {
    return res.status(204).json({ message: `No user mathces ${req.body.id}.` });
  }

  // Updated the user info with the info sent in the request
  if (req.body.username) user.username = req.body.username;
  if (req.body.roles) user.roles = req.body.username;
  if (req.body.password) user.password = req.body.password;

  const result = await user.save();
  res.json(result);
};

// delete user
const deleteUser = async (req, res) => {
  // check for user ID in req
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter required" });
  }

  // If the req has an ID then find that user
  const user = await User.findOne({ _id: req.body.id }).exec();

  if (!user) {
    return res.status(204).json({ message: `No user matches ${req.body.id}.` });
  }

  const result = await user.deleteOne({ _id: req.body.id });
  res.json({ message: "User successfully deleted!" }, result);
};

// request single users by id in the req parameter (URL)
const getUser = async (req, res) => {
  // Check for ID in url
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  // If there is an ID in the params then search for the user
  const user = await User.findOne({ _id: req.params.id }).exec();

  if (!user) {
    return res.status(204).json({ message: `No user matches ${req.body.id}.` });
  }

  res.status(200).json(user);
};

module.exports = {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  getUser,
};
