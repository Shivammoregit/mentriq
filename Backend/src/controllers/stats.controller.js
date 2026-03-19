const User = require("../models/User");
const Course = require("../models/Course");
const Partner = require("../models/Partner");
const SiteStats = require("../models/SiteStats");
const Enrollment = require("../models/Enrollment");
const Internship = require("../models/Internship");
const InternshipApplication = require("../models/InternshipApplication");
const VisitorSession = require("../models/VisitorSession");

// Helper to get daily counts for the last X days
const getDailyTrends = async (Model, dateField = "createdAt", days = 7) => {
    const trends = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await Model.countDocuments({
            [dateField]: { $gte: date, $lt: nextDate }
        });

        trends.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count
        });
    }
    return trends;
};

// @desc    Track visitor sessions and page visits
// @route   POST /api/stats/track
// @access  Public
const trackVisit = async (req, res) => {
    try {
        const { sessionId, path } = req.body;
        if (!sessionId || !path) return res.status(400).json({ message: "Missing tracking data" });

        const session = await VisitorSession.findOneAndUpdate(
            { sessionId },
            {
                $set: { lastPath: path, lastActivity: new Date() },
                $addToSet: { pathsVisited: path }
            },
            { upsert: true, new: true }
        );

        res.json({ status: "success", session: session.sessionId });
    } catch (error) {
        res.status(500).json({ message: "Tracking failed" });
    }
};

// @desc    Get global statistics for public site and dashboard
// @route   GET /api/stats
// @access  Public
const getGlobalStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: "student" });
        const courseCount = await Course.countDocuments();
        const partnerCount = await Partner.countDocuments();
        const internshipCount = await Internship.countDocuments({ status: "Active" });
        const enrolledUserIds = await Enrollment.distinct("user");
        const enrolledStudentCount = await User.countDocuments({
            _id: { $in: enrolledUserIds },
            role: "student"
        });

        // Visitor Analytics
        const activeSessions = await VisitorSession.countDocuments({
            lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Active in last 30 mins
        });

        // Aggregating popular pages (top 5)
        const popularPages = await VisitorSession.aggregate([
            { $unwind: "$pathsVisited" },
            { $group: { _id: "$pathsVisited", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]);

        // Dashboard specific analytics (charts)
        const userTrends = await getDailyTrends(User);
        const enrollmentTrends = await getDailyTrends(Enrollment);

        // Recent Activity Logging (last 5 items)
        const [recentEnrollments, recentApplications, recentUsers] = await Promise.all([
            Enrollment.find().sort({ createdAt: -1 }).limit(3).populate('user', 'name').populate('course', 'title'),
            InternshipApplication.find().sort({ createdAt: -1 }).limit(3).populate('internship', 'title'),
            User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(3).select('name createdAt')
        ]);

        const recentActivity = [
            ...recentEnrollments.map(e => ({
                id: e._id,
                type: 'enrollment',
                message: `${e.user?.name || 'A student'} enrolled in ${e.course?.title || 'a course'}`,
                time: e.createdAt
            })),
            ...recentApplications.map(a => ({
                id: a._id,
                type: 'internship',
                message: `${a.name} applied for ${a.internship?.title || 'Internship'}`,
                time: a.createdAt
            })),
            ...recentUsers.map(u => ({
                id: u._id,
                type: 'user',
                message: `New student ${u.name} joined the platform`,
                time: u.createdAt
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        const statsConfig = await SiteStats.findOne().lean();
        const defaultStudents = enrolledStudentCount.toString();
        const defaultCourses = courseCount.toString();
        const defaultPlacements = "0%";
        const defaultTrainers = "0";

        res.json({
            students: statsConfig?.students || defaultStudents,
            courses: statsConfig?.courses || defaultCourses,
            placements: statsConfig?.placements || defaultPlacements,
            trainers: statsConfig?.trainers || defaultTrainers,
            raw: {
                enrolledStudents: enrolledStudentCount || 0,
                students: studentCount || 0,
                courses: courseCount || 0,
                partners: partnerCount || 0,
                internships: internshipCount || 0,
                activeVisitors: activeSessions,
                homepageStudents: statsConfig?.students || defaultStudents,
                homepageCourses: statsConfig?.courses || defaultCourses,
                homepagePlacements: statsConfig?.placements || defaultPlacements,
                homepageTrainers: statsConfig?.trainers || defaultTrainers
            },
            analytics: {
                userTrends: userTrends || [],
                enrollmentTrends: enrollmentTrends || [],
                recentActivity: recentActivity || [],
                popularPages: popularPages.map(p => ({ path: p._id, count: p.count }))
            }
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update public stats display values
// @route   PUT /api/stats
// @access  Private/Staff
const updateGlobalStats = async (req, res) => {
    try {
        const { students, courses, placements, trainers } = req.body;

        const payload = {
            students: String(students || "").trim(),
            courses: String(courses || "").trim(),
            placements: String(placements || "").trim(),
            trainers: String(trainers || "").trim(),
            updatedBy: req.user?._id
        };

        if (!payload.students || !payload.courses || !payload.placements || !payload.trainers) {
            return res.status(400).json({ message: "All stats fields are required" });
        }

        const existing = await SiteStats.findOne();
        let saved;

        if (existing) {
            saved = await SiteStats.findByIdAndUpdate(existing._id, payload, { new: true });
        } else {
            saved = await SiteStats.create(payload);
        }

        return res.json({
            message: "Stats updated successfully",
            stats: {
                students: saved.students,
                courses: saved.courses,
                placements: saved.placements,
                trainers: saved.trainers
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getGlobalStats,
    updateGlobalStats,
    trackVisit
};
