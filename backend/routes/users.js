const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const { protect, admin } = require("../middleware/auth");

router.use(protect);

router.get("/", admin, usersController.listUsers);
router.get("/:id", admin, usersController.getUser);
router.put("/:id", admin, usersController.updateUser);
router.delete("/:id", admin, usersController.deleteUser);

module.exports = router;
