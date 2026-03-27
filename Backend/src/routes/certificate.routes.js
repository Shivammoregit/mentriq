const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');
const {
    generateCertificate,
    verifyCertificate,
    getCertificate,
    getUserCertificates,
    getAllCertificates,
    revokeCertificate,
    deleteCertificate,
    proxyTemplateImage
} = require('../controllers/certificate.controller');

// Public route - verify certificate
router.get('/template-proxy', proxyTemplateImage);
router.get('/verify/:certificateId', verifyCertificate);

// Protected routes - user access
router.get('/user/:userId', protect, getUserCertificates);
router.get('/user/:userId/course/:courseId', protect, getCertificate);

// Admin routes - certificate management
router.post('/generate', protect, isAdmin, generateCertificate);
router.get('/', protect, isAdmin, getAllCertificates);
router.put('/:id/revoke', protect, isAdmin, revokeCertificate);
router.delete('/:id', protect, isAdmin, deleteCertificate);

module.exports = router;
