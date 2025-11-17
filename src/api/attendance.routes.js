// src/api/attendance.routes.js
const express = require('express');
const router = express.Router();
const { addSubject, getSubjects, updateAttendance } = require('../controllers/attendance.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');

// All attendance routes should be protected
router.post('/subjects', authMiddleware, addSubject);
router.get('/subjects', authMiddleware, getSubjects);
router.patch('/subjects/:id', authMiddleware, updateAttendance);

module.exports = router;