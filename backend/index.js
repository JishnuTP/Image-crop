const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UploadRoutes = require('./routes/imageUpload'); // Adjust path as needed

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '20mb' })); // Set limit for JSON payloads
app.use(express.urlencoded({ limit: '20mb', extended: true })); // Set limit for URL-encoded payloads

// Test route
app.get("/", (req, res) => {
    res.json("hello");
});

// Ensure CORS pre-flight requests are handled
app.options('*', cors());

// API routes
app.use('/api', UploadRoutes);

// MongoDB connection
mongoose.connect("mongodb+srv://jishnu:WsHQjcIJSYUsKbxr@cluster0.hdboqfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
