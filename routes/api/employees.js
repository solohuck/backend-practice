const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
// import middleware
const verifyJWT = require('../../middleware/verifyJWT');

router
  .route("/")
  // It will go through the middleware first 'verifyJWT' and then go to the employeesController
  .get(verifyJWT, employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

// this would be used for a get request that has a parameter inside the url
router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
