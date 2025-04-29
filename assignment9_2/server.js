const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {

    const file = req.file;
    // size and type validation
    if (file.size > 1000000 && !file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return res.status(400).send({ message: "File size is too large and type is not supported" });
    }
    if (file.size > 1000000) {
        return res.status(400).send({ message: "File size is too large" });
    }
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return res.status(400).send({ message: "File type is not supported" })
    };

    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    res.status(200).json({
        message: 'File uploaded successfully',
        file: req.file.filename,
        downloadUrl: `http://localhost:${PORT}/download/${req.file.filename}`
    });
});

// Download endpoint
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
