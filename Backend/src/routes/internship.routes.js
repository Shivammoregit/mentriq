const express = require("express");
const {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    submitApplication,
    getApplications,
    updateApplicationStatus
} = require("../controllers/internship.controller");

const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

// Public routes
router.get("/", getInternships);
router.post("/apply", protect, submitApplication);

// Admin routes
router.get("/admin/applications", protect, isAdmin, getApplications);
router.put("/applications/:id", protect, isAdmin, updateApplicationStatus);
router.post("/", protect, isAdmin, createInternship);
router.put("/:id", protect, isAdmin, updateInternship);
router.delete("/:id", protect, isAdmin, deleteInternship);

// Keep parameterized route last so it does not shadow admin paths
router.get("/:id", getInternshipById);

module.exports = router;
