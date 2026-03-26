const express = require("express");
const { exportEntity, bulkAction } = require("../controllers/adminTools.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

router.post("/bulk", protect, isAdmin, bulkAction);
router.get("/export/:entity", protect, isAdmin, exportEntity);

module.exports = router;
