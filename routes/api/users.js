const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

router
  .route("/")
  .get(usersController.getUsers)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    usersController.postUser
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    usersController.putUser
  )
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route("/:id").get(usersController.getUser);

module.exports = router;
