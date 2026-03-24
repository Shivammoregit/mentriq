const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true },
        company: { type: String, required: true },
        description: { type: String },
        requirements: { type: String },
        responsibilities: { type: String },
        duration: { type: String },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        location: { type: String },
        type: {
            type: String,
            enum: ["Remote", "On-site", "Hybrid"],
            default: "Remote"
        },
        category: { type: String },
        thumbnail: { type: String },
        status: {
            type: String,
            enum: ["Active", "Closed"],
            default: "Active"
        },
        questions: [
            {
                id: { type: String },
                label: { type: String, required: true },
                type: {
                    type: String,
                    enum: ["text", "textarea", "select", "number", "file"],
                    default: "text"
                },
                required: { type: Boolean, default: false },
                options: [String] // For select types
            }
        ],
        deadline: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
