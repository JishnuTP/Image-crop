const mongoose = require('mongoose');

// Define the Image schema
const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Export the Image model
module.exports = mongoose.model('Image', imageSchema);
