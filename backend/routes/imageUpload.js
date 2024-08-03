const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const imageModel = require('../model/imageModel');

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




// Route to fetch all images
router.get('/images', async (req, res) => {
   
    
    try {
        const images = await imageModel.find().sort({createdAt:-1});
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching images', err });
    }
});


router.post('/upload', async (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).send('No image provided');
    }

    try {
        // Decode the base64 image string
        const buffer = Buffer.from(image, 'base64');
        
        // Create a stream for Cloudinary upload
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'uploads',
            format: 'jpg' // Ensure the image is saved with .jpg extension
        }, async (error, result) => {
            if (error) {
                console.error('Error uploading to Cloudinary:', error);
                return res.status(500).send('Error uploading image to Cloudinary');
            }

            try {
                // Save image URL in MongoDB
                const imageDoc = new imageModel({
                    url: result.secure_url
                });

                await imageDoc.save();
                res.status(200).json({ message: 'Image uploaded successfully', imageUrl: result.secure_url });
            } catch (dbError) {
                console.error('Error saving image to MongoDB:', dbError);
                res.status(500).send('Error saving image to database');
            }
        });

        // Convert the file buffer to a stream and pipe it to Cloudinary
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(uploadStream);

    } catch (err) {
        console.error('Error processing the image:', err);
        res.status(500).send('Error processing the image');
    }
});

// for coludinary data storage and the method used react-croper in front end use the below code /////


  // Handle file upload
// router.post('/upload', upload.single('image'), async (req, res) => {
//     console.log(req.file);
    
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         // Upload image to Cloudinary
//         const result = await new Promise((resolve, reject) => {
//             cloudinary.uploader.upload_stream({
//                 folder: 'uploads',
//                 format: 'jpg' // Ensure the image is saved with .jpg extension
//             }, (error, result) => {
//                 if (error) {
//                     return reject(error);
//                 }
//                 resolve(result);
//             }).end(req.file.buffer); // Stream the file buffer to Cloudinary
//         });

//         // Save image URL to MongoDB
//         const image = new Image({ url: result.secure_url });
//         const savedImage = await image.save();
//         res.json({ message: 'Image uploaded successfully', imageUrl: savedImage.url });

//     } catch (err) {
//         res.status(500).json({ message: 'Error uploading image', err });
//     }
// });

  

module.exports = router;
