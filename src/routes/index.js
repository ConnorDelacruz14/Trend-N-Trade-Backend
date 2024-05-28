const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

// Define your routes
router.get('/example', exampleController.getExamples);
router.post('/example', exampleController.createExample);

module.exports = router;
