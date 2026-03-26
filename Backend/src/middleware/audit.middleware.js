const AuditLog = require("../models/AuditLog");

const SENSITIVE_KEYS = new Set(["password", "token", "authorization", "cookie"]);

const sanitize = (value) => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = SENSITIVE_KEYS.has(String(key).toLowerCase()) ? "***" : sanitize(val);
    }
    return result;
  }
  if (typeof value === "string" && value.length > 500) return `${value.slice(0, 500)}...`;
  return value;
};

const resolveEntity = (path) => {
  const chunks = String(path || "").split("/").filter(Boolean);
  const apiIndex = chunks.indexOf("api");
  return apiIndex >= 0 ? (chunks[apiIndex + 1] || "") : (chunks[0] || "");
};

const resolveAction = (method, path) => {
  const lowerPath = String(path || "").toLowerCase();
  if (lowerPath.includes("/bulk")) return "bulk";
  if (lowerPath.includes("/export")) return "export";
  if (lowerPath.includes("/import")) return "import";
  if (method === "POST") return "create";
  if (method === "PUT" || method === "PATCH") return "update";
  if (method === "DELETE") return "delete";
  return "unknown";
};

const auditTrail = (req, res, next) => {
  res.on("finish", async () => {
    try {
      if (!req.user?._id) return;
      if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
      if (res.statusCode >= 500) return;

      await AuditLog.create({
        actor: req.user._id,
        actorEmail: req.user.email || "",
        actorRole: req.user.role || "",
        method: req.method,
        path: req.originalUrl || req.path,
        entity: resolveEntity(req.originalUrl || req.path),
        action: resolveAction(req.method, req.originalUrl || req.path),
        statusCode: res.statusCode,
        ip: req.ip || req.socket?.remoteAddress || "",
        userAgent: req.get("user-agent") || "",
        payload: sanitize(req.body || {})
      });
    } catch (error) {
      console.error("Audit trail error:", error.message);
    }
  });

  next();
};

module.exports = { auditTrail };
