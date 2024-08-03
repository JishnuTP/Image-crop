const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const Image = require('../model/imageModel'); // Adjust this according to your actual model import

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'duquyq1yz',
    api_key: '818531283297678',
    api_secret: 'gzDPZI4Rh9HYOsgTgR3EivvPIQY'
});

// Set up multer storage
const storage = multer.memoryStorage(); // Use memory storage for buffer
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // 10MB limit
});

// Handle file upload
router.post('/upload', upload.single('image'), async (req, res) => {
    console.log(req.file);
    
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: 'uploads',
                format: 'jpg' // Ensure the image is saved with .jpg extension
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }).end(req.file.buffer); // Stream the file buffer to Cloudinary
        });

        // Save image URL to MongoDB
        const image = new Image({ url: result.secure_url });
        const savedImage = await image.save();
        res.json({ message: 'Image uploaded successfully', imageUrl: savedImage.url });

    } catch (err) {
        res.status(500).json({ message: 'Error uploading image', err });
    }
});


// Route to fetch all images
router.get('/images', async (req, res) => {
    try {
        const images = await Image.find().sort({createdAt:-1});
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching images', err });
    }
});

module.exports = router;
