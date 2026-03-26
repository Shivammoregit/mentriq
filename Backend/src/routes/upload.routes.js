const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'asset-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif|svg|bmp|tiff|ico/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'image/svg+xml' || file.mimetype === 'image/x-icon';
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Supported formats: JPEG, JPG, PNG, WEBP, GIF, SVG, BMP, TIFF, ICO'));
    }
});

const templateUpload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = new Set([
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp'
        ]);
        const allowedExt = /\.(pdf|doc|docx|jpeg|jpg|png|webp)$/i.test(file.originalname || '');
        if (allowedMimes.has(file.mimetype) && allowedExt) return cb(null, true);
        cb(new Error('Supported template formats: PDF, DOC, DOCX, JPG, PNG, WEBP'));
    }
});

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            imagePath: imageUrl,
            path: imageUrl,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/template', templateUpload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No template uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({
            message: 'Template uploaded successfully',
            fileUrl,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
