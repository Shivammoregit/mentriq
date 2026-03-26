const Settings = require("../models/Settings");

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({}); // Create default if not exists
        }
        res.json(settings);
    } catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { email, phone, address, mapLink, socialLinks } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        settings.email = email || settings.email;
        settings.phone = phone || settings.phone;
        settings.address = address || settings.address;
        settings.mapLink = mapLink || settings.mapLink;

        if (socialLinks) {
            settings.socialLinks = {
                instagram: socialLinks.instagram !== undefined ? socialLinks.instagram : settings.socialLinks.instagram,
                linkedin: socialLinks.linkedin !== undefined ? socialLinks.linkedin : settings.socialLinks.linkedin,
                twitter: socialLinks.twitter !== undefined ? socialLinks.twitter : settings.socialLinks.twitter,
                whatsapp: socialLinks.whatsapp !== undefined ? socialLinks.whatsapp : settings.socialLinks.whatsapp,
                facebook: socialLinks.facebook !== undefined ? socialLinks.facebook : settings.socialLinks.facebook
            };
        }

        if (req.body.siteImages) {
            if (!settings.siteImages) settings.siteImages = {};
            settings.siteImages.hero = req.body.siteImages.hero !== undefined ? req.body.siteImages.hero : settings.siteImages.hero;
            settings.siteImages.about = req.body.siteImages.about !== undefined ? req.body.siteImages.about : settings.siteImages.about;
            settings.siteImages.mission = req.body.siteImages.mission !== undefined ? req.body.siteImages.mission : settings.siteImages.mission;
        }

        if (req.body.certificateTemplate) {
            const incoming = req.body.certificateTemplate || {};
            if (!settings.certificateTemplate) settings.certificateTemplate = {};
            settings.certificateTemplate.template = {
                url: incoming.template?.url !== undefined ? incoming.template.url : (settings.certificateTemplate.template?.url || ""),
                fileName: incoming.template?.fileName !== undefined ? incoming.template.fileName : (settings.certificateTemplate.template?.fileName || ""),
                mimeType: incoming.template?.mimeType !== undefined ? incoming.template.mimeType : (settings.certificateTemplate.template?.mimeType || "")
            };
            settings.certificateTemplate.fieldLayout =
                incoming.fieldLayout !== undefined
                    ? incoming.fieldLayout
                    : (settings.certificateTemplate.fieldLayout || {});
        }

        if (req.body.promo) {
            settings.promo = {
                isActive: req.body.promo.isActive !== undefined ? req.body.promo.isActive : settings.promo.isActive,
                discountPercentage: req.body.promo.discountPercentage !== undefined ? Number(req.body.promo.discountPercentage) : settings.promo.discountPercentage,
                endDate: req.body.promo.endDate === "" ? null : (req.body.promo.endDate !== undefined ? req.body.promo.endDate : settings.promo.endDate),
                title: req.body.promo.title !== undefined ? req.body.promo.title : settings.promo.title,
                appliesTo: {
                    courses: req.body.promo.appliesTo?.courses !== undefined ? req.body.promo.appliesTo.courses : settings.promo.appliesTo?.courses,
                    internships: req.body.promo.appliesTo?.internships !== undefined ? req.body.promo.appliesTo.internships : settings.promo.appliesTo?.internships
                }
            };
        }

        if (req.body.internshipPromo) {
            settings.internshipPromo = {
                isActive: req.body.internshipPromo.isActive !== undefined ? req.body.internshipPromo.isActive : settings.internshipPromo?.isActive,
                discountPercentage: req.body.internshipPromo.discountPercentage !== undefined ? Number(req.body.internshipPromo.discountPercentage) : settings.internshipPromo?.discountPercentage,
                endDate: req.body.internshipPromo.endDate === "" ? null : (req.body.internshipPromo.endDate !== undefined ? req.body.internshipPromo.endDate : settings.internshipPromo?.endDate),
                title: req.body.internshipPromo.title !== undefined ? req.body.internshipPromo.title : settings.internshipPromo?.title
            };
        }

        if (req.body.ticker) {
            settings.ticker = {
                isActive: req.body.ticker.isActive !== undefined ? req.body.ticker.isActive : settings.ticker?.isActive,
                message: req.body.ticker.message !== undefined ? req.body.ticker.message : settings.ticker?.message,
                highlight: req.body.ticker.highlight !== undefined ? req.body.ticker.highlight : settings.ticker?.highlight,
                showOnAllPages: req.body.ticker.showOnAllPages !== undefined ? req.body.ticker.showOnAllPages : settings.ticker?.showOnAllPages
            };
        }

        settings.updatedBy = req.user._id;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
