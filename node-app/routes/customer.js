const express = require("express");
const customerController = require("../controller/customer");
const isAuth = require("../middleware/auth");
const router = express.Router();

// GET /customer/login
router.post("/login", customerController.login);

// POST /customer/signup
router.post("/signup", customerController.signup);

// POST /customer/me
router.post("/me", isAuth, customerController.me);

module.exports = router;
