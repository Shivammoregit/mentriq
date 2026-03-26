const express = require("express");
const { getAuditLogs } = require("../controllers/audit.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

router.get("/", protect, isAdmin, getAuditLogs);

module.exports = router;
