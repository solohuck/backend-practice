const express = require("express");
const router = express.Router();
// Come up out of the routes folder, Then go into the controllers folder
const refreshTokenController = require("../controllers/refreshTokenController");
// Define the router or route
// Its a GET route and this will come in at the slash/root
// Then we pull in the refresh controller
router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;
