const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Course = require('../models/Course');
const Internship = require('../models/Internship');
const Settings = require('../models/Settings');
const QRCode = require('qrcode');
const axios = require('axios');

const SYSTEM_FIELD_LAYOUT = {
    studentName: { enabled: true, x: 50, y: 41.8 },
    programName: { enabled: true, x: 50, y: 55.5 },
    issueDate: { enabled: true, x: 26, y: 69.5 },
    completionDate: { enabled: true, x: 74, y: 69.5 },
    grade: { enabled: true, x: 50, y: 75 },
    certificateId: { enabled: true, x: 25, y: 87.5 },
    qrCode: { enabled: true, x: 82, y: 85, size: 15.5 }
};

// @desc    Generate certificate for a user
// @route   POST /api/certificates/generate
// @access  Private/Admin
exports.generateCertificate = async (req, res) => {
    try {
        const {
            userId,
            courseId,
            internshipId,
            type = 'Course',
            grade,
            completionDate,
            customName,
            customProgramName,
            template,
            fieldLayout
        } = req.body;

        let user = null;
        if (userId) {
            user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        let programName = "";

        if (type === 'Course' && courseId) {
            const course = await Course.findById(courseId);
            if (!course) return res.status(404).json({ message: 'Course not found' });
            programName = course.title;

            const existingCert = userId ? await Certificate.findOne({ user: userId, course: courseId }) : null;
            if (existingCert) return res.status(400).json({ message: 'Certificate already exists for this user and course', certificateId: existingCert.certificateId });
        } else if (type === 'Internship' && internshipId) {
            const internship = await Internship.findById(internshipId);
            if (!internship) return res.status(404).json({ message: 'Internship not found' });
            programName = internship.title;

            const existingCert = userId ? await Certificate.findOne({ user: userId, internship: internshipId }) : null;
            if (existingCert) return res.status(400).json({ message: 'Certificate already exists for this user and internship', certificateId: existingCert.certificateId });
        }

        const resolvedStudentName = String(customName || user?.name || "").trim();
        if (!resolvedStudentName) {
            return res.status(400).json({ message: 'Recipient name is required' });
        }

        const resolvedProgramName = String(programName || customProgramName || "").trim();

        // Enforce single-template mode: all certificates use global default template/layout.
        const settings = await Settings.findOne().sort({ updatedAt: -1, _id: -1 });
        const defaultTemplate = settings?.certificateTemplate?.template || {};
        const incomingTemplateUrl = String(template?.url || "").trim();
        const templateUrl = incomingTemplateUrl || String(defaultTemplate.url || "").trim();
        const resolvedFieldLayout =
            fieldLayout && typeof fieldLayout === "object" && Object.keys(fieldLayout).length
                ? fieldLayout
                : SYSTEM_FIELD_LAYOUT;

        if (!templateUrl) {
            return res.status(400).json({
                message: 'Default certificate template is not configured in settings.'
            });
        }

        // Generate unique certificate ID
        let certificateId;
        let isUnique = false;

        while (!isUnique) {
            certificateId = Certificate.generateCertificateId();
            const existing = await Certificate.findOne({ certificateId });
            if (!existing) isUnique = true;
        }

        // Generate QR code with certificate verification URL
        const verificationUrl = `${process.env.CLIENT_URL}/verify-certificate?id=${certificateId}`;
        const qrCodeData = await QRCode.toDataURL(verificationUrl);

        // Create certificate
        const certificate = new Certificate({
            certificateId,
            user: userId || undefined,
            course: type === 'Course' && courseId ? courseId : undefined,
            internship: type === 'Internship' && internshipId ? internshipId : undefined,
            type: type,
            studentName: resolvedStudentName,
            courseName: resolvedProgramName,
            qrCodeData,
            grade: grade || "",
            completionDate: completionDate || undefined,
            template: {
                url: templateUrl,
                fileName: String(template?.fileName || defaultTemplate.fileName || "default-certificate-template").trim(),
                mimeType: String(template?.mimeType || defaultTemplate.mimeType || "").trim()
            },
            fieldLayout: resolvedFieldLayout
        });

        await certificate.save();

        res.status(201).json({
            message: 'Certificate generated successfully',
            certificate: {
                certificateId: certificate.certificateId,
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                issueDate: certificate.issueDate,
                qrCodeData: certificate.qrCodeData
            }
        });

    } catch (error) {
        console.error('Certificate generation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify certificate by ID
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({ certificateId })
            .populate('user', 'name email')
            .populate('course', 'title category duration modules')
            .populate('internship', 'title category duration technologies');

        if (!certificate) {
            return res.status(404).json({
                valid: false,
                message: 'Certificate not found. Please check the certificate ID and try again.'
            });
        }

        if (certificate.status === 'Revoked') {
            return res.status(200).json({
                valid: false,
                message: 'This certificate has been revoked and is no longer valid.'
            });
        }
        
        const isInternship = certificate.type === 'Internship';
        const programRecord = isInternship ? certificate.internship : certificate.course;

        res.status(200).json({
            valid: true,
            certificateId: certificate.certificateId,
            studentName: certificate.studentName,
            courseName: certificate.courseName,
            type: certificate.type || 'Course',
            duration: programRecord?.duration || 'N/A',
            modules: isInternship ? (programRecord?.technologies || []) : (programRecord?.modules || []),
            issueDate: certificate.issueDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            completionDate: certificate.completionDate ? certificate.completionDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : null,
            grade: certificate.grade,
            status: certificate.status
        });

    } catch (error) {
        console.error('Certificate verification error:', error);
        res.status(500).json({
            valid: false,
            message: 'Error verifying certificate. Please try again later.'
        });
    }
};

// @desc    Get certificate by user and course
// @route   GET /api/certificates/user/:userId/course/:courseId
// @access  Private
exports.getCertificate = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const certificate = await Certificate.findOne({
            user: userId,
            course: courseId
        });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.status(200).json(certificate);

    } catch (error) {
        console.error('Get certificate error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all certificates for a user
// @route   GET /api/certificates/user/:userId
// @access  Private
exports.getUserCertificates = async (req, res) => {
    try {
        const { userId } = req.params;

        const certificates = await Certificate.find({ user: userId })
            .populate('course', 'title category thumbnailUrl')
            .sort({ issueDate: -1 });

        res.status(200).json(certificates);

    } catch (error) {
        console.error('Get user certificates error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
// @access  Private/Admin
exports.getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find()
            .populate('user', 'name email')
            .populate('course', 'title category')
            .sort({ issueDate: -1 });

        res.status(200).json(certificates);

    } catch (error) {
        console.error('Get all certificates error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Revoke certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private/Admin
exports.revokeCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        certificate.status = 'Revoked';
        await certificate.save();

        res.status(200).json({
            message: 'Certificate revoked successfully',
            certificate
        });

    } catch (error) {
        console.error('Revoke certificate error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        await Certificate.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        console.error('Delete certificate error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Proxy certificate template image for safe frontend capture
// @route   GET /api/certificates/template-proxy?url=<encodedImageUrl>
// @access  Public
exports.proxyTemplateImage = async (req, res) => {
    try {
        const rawUrl = String(req.query.url || '').trim();
        if (!rawUrl) {
            return res.status(400).json({ message: 'Image URL is required' });
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(rawUrl);
        } catch {
            return res.status(400).json({ message: 'Invalid image URL' });
        }

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return res.status(400).json({ message: 'Unsupported URL protocol' });
        }

        const hostname = (parsedUrl.hostname || '').toLowerCase();
        const isPrivateHost =
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '::1' ||
            /^10\./.test(hostname) ||
            /^192\.168\./.test(hostname) ||
            /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

        if (isPrivateHost) {
            return res.status(400).json({ message: 'Blocked host' });
        }

        const upstream = await axios.get(parsedUrl.toString(), {
            responseType: 'arraybuffer',
            timeout: 15000,
            maxContentLength: 10 * 1024 * 1024,
            validateStatus: (status) => status >= 200 && status < 400
        });

        const contentType = String(upstream.headers['content-type'] || '').toLowerCase();
        if (!contentType.startsWith('image/')) {
            return res.status(400).json({ message: 'URL does not point to an image' });
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(Buffer.from(upstream.data));
    } catch (error) {
        return res.status(502).json({ message: 'Failed to fetch template image' });
    }
};
