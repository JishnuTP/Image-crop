const express = require('express');
const app = express();
const cors = require('cors');
const UploadRoutes = require('./routes/imageUpload'); // Adjust path as needed
const mongoose= require("mongoose")
app.use(cors());
app.use(express.json());



// Test route
app.get("/", (req, res) => {
    res.json("hello");
});
app.options('*', cors());

app.use('/api', UploadRoutes);

mongoose.connect("mongodb+srv://jishnu:WsHQjcIJSYUsKbxr@cluster0.hdboqfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
