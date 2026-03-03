const mongoose = require('mongoose');
const Settings = require('../src/models/Settings');
require('dotenv').config();

const updateSettings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const socialLinks = {
            instagram: "https://www.instagram.com/mentriqtechnologies/",
            linkedin: "https://www.linkedin.com/company/mentriqtechnologies/",
            facebook: "https://www.facebook.com/profile.php?id=61588480116895",
            twitter: "https://x.com/MentriqT51419",
            whatsapp: "https://wa.me/918890301264"
        };

        const email = "support@mentriqtechnologies.in";
        const phone = "+918890301264";
        const address = "Mentriq Technologies, 2nd floor, 34/501, Haldighati Marg E, Sector 3, Pratap Nagar, Sanganer, Jaipur, 302033";

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ email, phone, address, socialLinks });
            console.log('Creating new settings document...');
        } else {
            settings.email = email;
            settings.phone = phone;
            settings.address = address;
            settings.socialLinks = socialLinks;
            console.log('Updating existing settings document...');
        }

        await settings.save();
        console.log('✅ Settings updated successfully!');
        process.exit();
    } catch (error) {
        console.error('Error updating settings:', error);
        process.exit(1);
    }
};

updateSettings();
