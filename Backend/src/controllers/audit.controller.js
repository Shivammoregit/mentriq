const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25)));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.entity) query.entity = req.query.entity;
    if (req.query.action) query.action = req.query.action;
    if (req.query.actor) query.actor = req.query.actor;
    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) query.createdAt.$lte = new Date(req.query.to);
    }

    const [items, total] = await Promise.all([
      AuditLog.find(query)
        .populate("actor", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(query)
    ]);

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get audit logs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAuditLogs };
