const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  // This route is available to all users. No Admin or Editor key reqiured
  .get(employeesController.getAllEmployees)
  // This route will be limited to only users who have an Amin or Editor key
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
  )
  // This route will be limited to only users who have an Amin or Editor key
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
  )
  // This route will be limited to only users who have an Amin key
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

// this would be used for a get request that has a parameter inside the url
router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
