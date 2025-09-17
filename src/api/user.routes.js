// src/api/user.routes.js
const express = require('express');
const router = express.Router();


const { registerUser } = require('../controllers/user.controller.js');


router.post('/register', registerUser);

module.exports = router;