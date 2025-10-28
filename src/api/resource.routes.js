// src/api/resource.routes.js
const express = require('express');
const router = express.Router();
const { createResource, getAllResources, getResourceById } = require('../controllers/resource.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');

router.post('/', authMiddleware, createResource);


router.get('/', getAllResources);
router.get('/:id', getResourceById);



module.exports = router;