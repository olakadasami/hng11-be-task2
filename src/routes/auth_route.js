const express = require("express");
const register = require("../controllers/auth/register_controller");
const login = require("../controllers/auth/login_controller");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

module.exports = router;
