const express = require("express");
const protect = require("../middlewares/protect");
const { getUser } = require("../controllers/users_controller");

const router = express.Router();

router.get("/:id", protect, getUser);

module.exports = router;
