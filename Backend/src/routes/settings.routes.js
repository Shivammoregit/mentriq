const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settings.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.get("/", getSettings);
router.put("/", protect, authorize("admin", "moderator", "superadmin"), updateSettings);

module.exports = router;
