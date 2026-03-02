const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/img'),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

// POST /api/file — upload wine image, saved to public/img/
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.send(req.file.filename);
});

module.exports = router;
