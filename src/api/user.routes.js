// src/api/user.routes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/user.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js'); 

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/me', authMiddleware, getUserProfile);


module.exports = router;