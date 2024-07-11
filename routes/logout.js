const express = require("express");
const router = express.Router();
// Come up out of the routes folder, Then go into the controllers folder
const logoutController = require("../controllers/logoutController");
// Define the router or route
// Its a GET route and this will come in at the slash/root
// Then we pull in the refresh controller
router.get("/", logoutController.handleLogout);

module.exports = router;
 