const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes
router.get('/getUsers', userController.getUsers);
router.get('/getUser', userController.getUser);
router.post('/createUser', userController.createUser);

module.exports = router;