const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false
    },
    internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: false
    },
    type: {
        type: String,
        enum: ['Course', 'Internship'],
        default: 'Course'
    },
    studentName: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: false,
        default: ""
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    completionDate: {
        type: Date
    },
    qrCodeData: {
        type: String // Base64 encoded QR code image
    },
    grade: {
        type: String,
        default: ""
    },
    template: {
        url: { type: String, default: "" },
        fileName: { type: String, default: "" },
        mimeType: { type: String, default: "" }
    },
    fieldLayout: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    status: {
        type: String,
        enum: ['Active', 'Revoked'],
        default: 'Active'
    }
}, { timestamps: true });

// Generate unique certificate ID
certificateSchema.statics.generateCertificateId = function () {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `CERT-${year}-${randomNum}`;
};

module.exports = mongoose.model('Certificate', certificateSchema);
