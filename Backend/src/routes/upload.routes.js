const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { Readable } = require('stream');

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
    storage: multer.memoryStorage(),
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

const getTemplateBucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'certificateTemplates'
});

const uploadTemplateToGridFS = (file) => new Promise((resolve, reject) => {
    try {
        const bucket = getTemplateBucket();
        const stream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
            metadata: {
                originalName: file.originalname,
                uploadedAt: new Date()
            }
        });

        stream.on('error', reject);
        stream.on('finish', () => resolve(stream.id));

        Readable.from(file.buffer).pipe(stream);
    } catch (error) {
        reject(error);
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
        uploadTemplateToGridFS(req.file)
            .then((fileId) => {
                const fileUrl = `/api/upload/template/${String(fileId)}`;
                res.status(200).json({
                    message: 'Template uploaded successfully',
                    fileUrl,
                    fileName: req.file.originalname,
                    mimeType: req.file.mimetype,
                    success: true
                });
            })
            .catch((error) => {
                res.status(500).json({ message: error.message || 'Template upload failed' });
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/template/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid template id' });
        }

        const objectId = new mongoose.Types.ObjectId(id);
        const files = await mongoose.connection.db
            .collection('certificateTemplates.files')
            .find({ _id: objectId })
            .limit(1)
            .toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'Template not found' });
        }

        const file = files[0];
        res.set('Content-Type', file.contentType || 'application/octet-stream');
        res.set('Cache-Control', 'public, max-age=31536000, immutable');

        const bucket = getTemplateBucket();
        const downloadStream = bucket.openDownloadStream(objectId);
        downloadStream.on('error', () => res.status(404).end());
        downloadStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch template' });
    }
});

module.exports = router;
