const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getTechnologies, createTechnology, deleteTechnology } = require('../controllers/tech.controllers');
const authMiddleware = require('../middleware/auth.middlewares');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/', getTechnologies);
router.post('/', authMiddleware('admin'), upload.single('image'), createTechnology);
router.delete('/:techId', authMiddleware('admin'), deleteTechnology);

module.exports = router;