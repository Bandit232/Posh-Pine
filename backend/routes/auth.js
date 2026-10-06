const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const { registerValidator, loginValidator, adminLoginValidator } = require("../utils/validators");

router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.post("/admin-login", adminLoginValidator, authController.adminLogin);
router.post("/logout", authController.logout);
router.get("/me", protect, authController.getProfile);
router.put("/me", protect, authController.updateProfile);

module.exports = router;
