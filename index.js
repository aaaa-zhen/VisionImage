const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('.'));

// GET request to root, return index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST route for uploading files
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Read uploaded image file
  fs.readFile(req.file.path, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read uploaded file.' });
    }

    // Convert image to base64 encoding
    const base64Image = data.toString('base64');

    // Return base64 encoded image data to the client
    res.json({ base64Image: base64Image });
  });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
