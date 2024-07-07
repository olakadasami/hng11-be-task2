const express = require("express");
const protect = require("../middlewares/protect");
const {
  index,
  show,
  addUserToOrg,
  createNewOrg,
} = require("../controllers/organisations_controller");

const router = express.Router();

router.get("/", protect, index);
router.get("/:orgId", protect, show);
router.post("/", protect, createNewOrg);
router.post("/:orgId/users", addUserToOrg);

module.exports = router;
