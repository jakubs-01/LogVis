const express = require("express");
const authController = require("../controllers/auth-controller");

const router = express.Router();

router.get("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/callback", authController.callback);
router.get("/user", authController.user);

module.exports = router;
