const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    email: { type: String, trim: true, default: "support@mentriqtechnologies.in" },
    phone: { type: String, trim: true, default: "+918890301264" },
    address: { type: String, trim: true, default: "MentriQ Technologies, Sector 3, Jaipur" },
    mapLink: { type: String, trim: true, default: "" },
    socialLinks: {
        instagram: { type: String, trim: true, default: "https://www.instagram.com/mentriqtechnologies/" },
        linkedin: { type: String, trim: true, default: "https://www.linkedin.com/company/mentriqtechnologies/" },
        twitter: { type: String, trim: true, default: "https://x.com/MentriqT51419" },
        whatsapp: { type: String, trim: true, default: "https://wa.me/918890301264" },
        facebook: { type: String, trim: true, default: "https://www.facebook.com/profile.php?id=61588480116895" }
    },
    promo: {
        isActive: { type: Boolean, default: false },
        discountPercentage: { type: Number, default: 0 },
        endDate: { type: Date, default: null },
        title: { type: String, trim: true, default: "Special Discount!" }
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
