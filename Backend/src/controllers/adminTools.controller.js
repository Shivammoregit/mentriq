const Course = require("../models/Course");
const Internship = require("../models/Internship");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/Certificate");

const toCsvValue = (val) => {
  const text = val == null ? "" : String(val);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

const sendCsv = (res, fileName, rows) => {
  const csv = rows.map((r) => r.map(toCsvValue).join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  return res.status(200).send(csv);
};

const exportEntity = async (req, res) => {
  try {
    const { entity } = req.params;

    if (entity === "users") {
      const users = await User.find({}, "name email role createdAt updatedAt").sort({ createdAt: -1 });
      const rows = [
        ["id", "name", "email", "role", "createdAt", "updatedAt"],
        ...users.map((u) => [u._id, u.name, u.email, u.role, u.createdAt?.toISOString(), u.updatedAt?.toISOString()])
      ];
      return sendCsv(res, "users.csv", rows);
    }

    if (entity === "enrollments") {
      const enrollments = await Enrollment.find({})
        .populate("user", "name email")
        .populate("course", "title category")
        .sort({ createdAt: -1 });
      const rows = [
        ["id", "userName", "userEmail", "courseTitle", "courseCategory", "status", "paymentStatus", "pricePaid", "totalFee", "createdAt"],
        ...enrollments.map((e) => [
          e._id,
          e.user?.name || "",
          e.user?.email || "",
          e.course?.title || "",
          e.course?.category || "",
          e.status || "",
          e.paymentStatus || "",
          e.pricePaid || 0,
          e.totalFee || 0,
          e.createdAt?.toISOString()
        ])
      ];
      return sendCsv(res, "enrollments.csv", rows);
    }

    if (entity === "certificates") {
      const certificates = await Certificate.find({}).sort({ createdAt: -1 });
      const rows = [
        ["id", "certificateId", "studentName", "courseName", "type", "grade", "status", "issueDate", "completionDate"],
        ...certificates.map((c) => [
          c._id,
          c.certificateId || "",
          c.studentName || "",
          c.courseName || "",
          c.type || "",
          c.grade || "",
          c.status || "",
          c.issueDate ? new Date(c.issueDate).toISOString() : "",
          c.completionDate ? new Date(c.completionDate).toISOString() : ""
        ])
      ];
      return sendCsv(res, "certificates.csv", rows);
    }

    return res.status(400).json({ message: "Unsupported export entity" });
  } catch (error) {
    console.error("Export entity error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const bulkAction = async (req, res) => {
  try {
    const { entity, action, ids = [] } = req.body;
    if (!entity || !action || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "entity, action and ids[] are required" });
    }

    if (entity === "courses") {
      if (action !== "delete") return res.status(400).json({ message: "Only delete action supported for courses" });
      const result = await Course.deleteMany({ _id: { $in: ids } });
      return res.json({ success: true, modifiedCount: result.deletedCount });
    }

    if (entity === "internships") {
      if (action === "delete") {
        const result = await Internship.deleteMany({ _id: { $in: ids } });
        return res.json({ success: true, modifiedCount: result.deletedCount });
      }
      if (action === "activate" || action === "close") {
        const status = action === "activate" ? "Active" : "Closed";
        const result = await Internship.updateMany({ _id: { $in: ids } }, { $set: { status } });
        return res.json({ success: true, modifiedCount: result.modifiedCount || result.nModified || 0 });
      }
      return res.status(400).json({ message: "Unsupported internship action" });
    }

    if (entity === "users") {
      if (action !== "delete") return res.status(400).json({ message: "Only delete action supported for users" });
      const result = await User.deleteMany({ _id: { $in: ids }, role: { $ne: "superadmin" } });
      return res.json({ success: true, modifiedCount: result.deletedCount });
    }

    if (entity === "certificates") {
      if (action === "delete") {
        const result = await Certificate.deleteMany({ _id: { $in: ids } });
        return res.json({ success: true, modifiedCount: result.deletedCount });
      }
      if (action === "revoke") {
        const result = await Certificate.updateMany({ _id: { $in: ids } }, { $set: { status: "Revoked" } });
        return res.json({ success: true, modifiedCount: result.modifiedCount || result.nModified || 0 });
      }
      return res.status(400).json({ message: "Unsupported certificate action" });
    }

    return res.status(400).json({ message: "Unsupported entity" });
  } catch (error) {
    console.error("Bulk action error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  exportEntity,
  bulkAction
};
