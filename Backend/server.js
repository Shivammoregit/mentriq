const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
const authRoutes = require("./src/routes/auth.routes");
const courseRoutes = require("./src/routes/course.routes");
const enrollmentRoutes = require("./src/routes/enrollment.routes");
const mentorRoutes = require("./src/routes/mentor.routes");
const feedbackRoutes = require("./src/routes/feedback.routes");
const partnerRoutes = require("./src/routes/partner.routes");
const uploadRoutes = require("./src/routes/upload.routes");
const settingsRoutes = require("./src/routes/settings.routes");
const userRoutes = require("./src/routes/user.routes");
const internshipRoutes = require("./src/routes/internship.routes");
const journeyRoutes = require("./src/routes/journey.routes");
const certificateRoutes = require("./src/routes/certificate.routes");
const serviceRoutes = require("./src/routes/service.routes");
const jobRoutes = require("./src/routes/jobPost.routes");
const contactRoutes = require("./src/routes/contact.routes");
const statsRoutes = require("./src/routes/stats.routes");
const technologyRoutes = require("./src/routes/technology.routes");
const cityRoutes = require("./src/routes/city.routes");
const recruitRoutes = require("./src/routes/recruit.routes");
const auditRoutes = require("./src/routes/audit.routes");
const adminToolsRoutes = require("./src/routes/adminTools.routes");

const { notFound, errorHandler } = require("./src/middleware/error.middleware");
const ensureSuperAdmin = require("./src/utils/ensureSuperAdmin");
const { auditTrail } = require("./src/middleware/audit.middleware");

dotenv.config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Infrastructure link capacity reached. Please hold...",
});

const app = express();

// 1. CORS CONFIGURATION (MUST BE AT THE TOP)
const envOrigins = String(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.mentriqtechnologies.in",
    "https://mentriqtechnologies.in",
    "https://mentriq-technologies-zeta.vercel.app",
    ...envOrigins
].filter(Boolean));

const corsOptions = {
    origin: (origin, callback) => {
        // Skip check for non-browser environments or if origin matches allowed set
        if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) {
            return callback(null, true);
        }

        // Allow all mentriqtechnologies.in and vercel.app subdomains for flexibility
        try {
            const { protocol, hostname } = new URL(origin);
            if (protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1")) return callback(null, true);
            if (protocol === "https:" && (
                hostname.endsWith("mentriqtechnologies.in") ||
                hostname.endsWith("vercel.app")
            )) {
                return callback(null, true);
            }
        } catch (e) {
            // Ignore URL parsing errors
        }

        callback(new Error('Cross-Origin Access Denied'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.set('trust proxy', 1);

app.use("/api", limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(auditTrail);

app.get("/api/health", (req, res) => res.status(200).send("MentriQ Health OK - v6"));

app.get("/", (req, res) => res.json({
    status: "MentriQ API running",
    version: "debug-v6",
    activeOrigins: ["ALL (fail-open enabled)"]
}));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/technologies", technologyRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/recruit", recruitRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/admin-tools", adminToolsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    await ensureSuperAdmin();
    app.listen(PORT, () => {
        console.log(`🚀 MentriQ Infrastructure Link Established on Port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});
