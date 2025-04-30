const express = require('express');
const router = express.Router();
const { getReviewsByTech, createReview, deleteReview } = require('../controllers/review.controllers');
const authMiddleware = require('../middleware/auth.middlewares');

router.get('/:techId', getReviewsByTech);
router.post('/', authMiddleware(), createReview);
router.delete('/:reviewId', authMiddleware(), deleteReview);

module.exports = router;