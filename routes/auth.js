const express = require("express");
const router = express.Router();
// Come up out of the routes folder, Then go into the controllers folder
const authController = require("../controllers/authController");
// Define the router or route
// Its a post route and this will come in at the slash/root
// Then we pull in the auth controller
router.post("/", authController.handleLogin);

module.exports = router;
