// src/api/resource.routes.js
const express = require('express');
const router = express.Router();
const { createResource } = require('../controllers/resource.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');

// @route   POST /api/resources
// @desc    Create a new resource
// @access  Private (because we use authMiddleware)
router.post('/', authMiddleware, createResource);


module.exports = router;