// src/api/user.routes.js
const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/user.controller.js');

// This connects the /register path to our controller logic
router.post('/register', registerUser);

module.exports = router;