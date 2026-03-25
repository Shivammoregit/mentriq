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
        required: true
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
        required: true
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
        enum: ['A+', 'A', 'B+', 'B', 'C', 'Pass'],
        default: 'Pass'
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
