const express = require('express');
const router = express.Router();
const techController = require('../controllers/tech.controllers');
const authMiddleware = require('../middleware/auth.middlewares');

router.post('/', authMiddleware, techController.createTechnology); // Correct: Pass the function reference
router.get('/', techController.getAllTechnologies);
router.get('/:id', techController.getTechnologyById);
router.put('/:id', authMiddleware, techController.updateTechnology);
router.delete('/:id', authMiddleware, techController.deleteTechnology);

module.exports = router;