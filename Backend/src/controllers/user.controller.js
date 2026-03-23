const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendBroadcastEmail } = require("../utils/emailService");
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "admin@mentriqtechnologies.in";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("GET USERS ERROR", error);
        res.status(500).json({ message: "Server error" });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const allowedRoles = ["student", "moderator", "admin"];
        const safeRole = allowedRoles.includes(role) ? role : "student";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: safeRole
        });

        return res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("CREATE USER ERROR", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const targetUser = await User.findById(id);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        // PROTECT SUPER ADMIN
        if (targetUser.email === SUPER_ADMIN_EMAIL) {
            return res.status(403).json({ message: "Super Admin role cannot be changed" });
        }

        if (!["student", "moderator", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        console.error("UPDATE ROLE ERROR", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const targetUser = await User.findById(id);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        // PROTECT SUPER ADMIN
        if (targetUser.email === SUPER_ADMIN_EMAIL) {
            return res.status(403).json({ message: "Super Admin cannot be deleted" });
        }

        await User.findByIdAndDelete(id);
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("DELETE USER ERROR", error);
        res.status(500).json({ message: "Server error" });
    }
};

const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const targetUser = await User.findById(id);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        // Prevent modifying Super Admin by others (optional, but good practice)
        // Checks if target is super admin and requester is NOT super admin
        if (targetUser.email === SUPER_ADMIN_EMAIL && req.user.email !== SUPER_ADMIN_EMAIL) {
            return res.status(403).json({ message: "Only Super Admin can reset their own password" });
        }

        const salt = await bcrypt.genSalt(10);
        targetUser.password = await bcrypt.hash(password, salt);
        await targetUser.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("RESET PASSWORD ERROR", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const targetUser = await User.findById(id);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        // PROTECT SUPER ADMIN EMAIL CHANGE
        if (targetUser.email === SUPER_ADMIN_EMAIL && email && email !== SUPER_ADMIN_EMAIL) {
            return res.status(403).json({ message: "Super Admin email cannot be changed" });
        }

        if (email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser && existingUser._id.toString() !== id) {
                return res.status(400).json({ message: "Email already in use" });
            }
            targetUser.email = email.toLowerCase();
        }

        if (name) targetUser.name = name;

        await targetUser.save();

        res.json({
            success: true,
            user: {
                _id: targetUser._id,
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role,
                createdAt: targetUser.createdAt
            }
        });
    } catch (error) {
        console.error("UPDATE USER ERROR", error);
        res.status(500).json({ message: "Server error" });
    }
};

const broadcastMessage = async (req, res) => {
    try {
        const { subject, message, roleFilter } = req.body;
        
        if (!subject || !message) {
            return res.status(400).json({ message: "Subject and Message are required" });
        }

        const query = roleFilter ? { role: roleFilter } : {};
        const users = await User.find(query, "email");
        
        if (users.length === 0) {
            return res.status(404).json({ message: "No recipients match the filter" });
        }

        const bccEmails = users.map(u => u.email).filter(e => e);

        // Call email service
        await sendBroadcastEmail(bccEmails, subject, message);

        res.json({ success: true, message: `Broadcast sent to ${bccEmails.length} recipients successfully` });
    } catch (error) {
        console.error("BROADCAST MESSAGE ERROR", error);
        res.status(500).json({ message: "Failed to broadcast message" });
    }
};

module.exports = { getAllUsers, createUser, updateUserRole, deleteUser, resetUserPassword, updateUser, broadcastMessage };
