const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    email: { type: String, trim: true, default: "support@mentriqtechnologies.in" },
    phone: { type: String, trim: true, default: "+918890301264" },
    address: { type: String, trim: true, default: "MentriQ Technologies, 2nd floor, 34/501, Haldighati Marg E, Sanganer, Sector 3, Pratap Nagar, Jaipur, Rajasthan 302033" },
    mapLink: { type: String, trim: true, default: "https://www.google.com/maps/place/MentriQ+Technologies/@26.8020093,75.4882598,10z/data=!4m22!1m15!4m14!1m6!1m2!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!2sMentriQ+Technologies,+2nd+floor,+34%2F501,+Haldighati+Marg+E,+Sanganer,+Sector+3,+Pratap+Nagar,+Jaipur,+Rajasthan+302033!2m2!1d75.8047414!2d26.8023101!1m6!1m2!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!2sMentriQ+Technologies,+2nd+floor,+34%2F501,+Haldighati+Marg+E,+Sanganer,+Sector+3,+Pratap+Nagar,+Jaipur,+Rajasthan+302033!2m2!1d75.8047414!2d26.8023101!3m5!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!8m2!3d26.8023101!4d75.8047414!16s%2Fg%2F11yy2ld3gd?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D" },
    socialLinks: {
        instagram: { type: String, trim: true, default: "https://www.instagram.com/mentriqtechnologies/" },
        linkedin: { type: String, trim: true, default: "https://www.linkedin.com/company/mentriqtechnologies/" },
        twitter: { type: String, trim: true, default: "https://x.com/MentriqT51419" },
        whatsapp: { type: String, trim: true, default: "https://wa.me/918890301264" },
        facebook: { type: String, trim: true, default: "https://www.facebook.com/profile.php?id=61588480116895" }
    },
    siteImages: {
        hero: { type: String, default: "" },
        about: { type: String, default: "" },
        mission: { type: String, default: "/images/learning4.jpg" }
    },
    certificateTemplate: {
        template: {
            url: { type: String, default: "" },
            fileName: { type: String, default: "" },
            mimeType: { type: String, default: "" }
        },
        fieldLayout: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    promo: {
        isActive: { type: Boolean, default: false },
        discountPercentage: { type: Number, default: 0 },
        endDate: { type: Date, default: null },
        title: { type: String, trim: true, default: "Special Discount!" },
        appliesTo: {
            courses: { type: Boolean, default: true },
            internships: { type: Boolean, default: false }
        }
    },
    internshipPromo: {
        isActive: { type: Boolean, default: false },
        discountPercentage: { type: Number, default: 0 },
        endDate: { type: Date, default: null },
        title: { type: String, trim: true, default: "Internship Discount!" }
    },
    ticker: {
        isActive: { type: Boolean, default: false },
        message: { type: String, trim: true, default: "" },
        highlight: { type: String, trim: true, default: "" },
        showOnAllPages: { type: Boolean, default: true }
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
