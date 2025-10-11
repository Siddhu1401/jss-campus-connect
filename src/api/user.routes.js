// src/api/user.routes.js
const express = require('express');
const router = express.Router();
// Import both functions from the controller
const { registerUser, loginUser } = require('../controllers/user.controller.js');

// This is your existing registration route
router.post('/register', registerUser);

// --- ADD THIS NEW ROUTE FOR LOGIN ---
router.post('/login', loginUser);

module.exports = router;