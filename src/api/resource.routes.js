// src/api/resource.routes.js
const express = require('express');
const router = express.Router();
// Import the new function
const { 
    createResource, 
    getAllResources, 
    getResourceById, 
    deleteResource, 
    verifyResource 
} = require('../controllers/resource.controller.js');

const authMiddleware = require('../middleware/auth.middleware.js');

// ... existing routes ...
router.post('/', authMiddleware, createResource);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.delete('/:id', authMiddleware, deleteResource);

// --- ADD THIS NEW TEACHER-ONLY ROUTE ---
// @route   PATCH /api/resources/:id/verify
// @desc    Mark a resource as verified (Teacher only)
// @access  Private (Teacher)
router.patch('/:id/verify', authMiddleware, verifyResource);


module.exports = router;