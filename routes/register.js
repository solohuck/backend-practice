const express = require("express");
const router = express.Router();
// Come up out of the routes folder, Then go into the controllers folder
const registerController = require("../controllers/registerController");
// Define the router or route
// Its a post route and this will come in at the slash/root
// Then we pull in the register controller
router.post("/", registerController.handleNewUser);

module.exports = router;
