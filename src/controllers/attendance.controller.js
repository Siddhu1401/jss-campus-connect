// src/controllers/attendance.controller.js
const pool = require('../config/db');

// --- Existing Function ---
const addSubject = async (req, res) => {
    const { subject_name, total_classes, attended_classes } = req.body;
    const userId = req.user.id;

    if (!subject_name) {
        return res.status(400).json({ msg: 'Please provide a subject name' });
    }

    try {
        const newSubject = await pool.query(
            'INSERT INTO subjects (user_id, subject_name, total_classes, attended_classes) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, subject_name, total_classes || 0, attended_classes || 0]
        );

        res.status(201).json(newSubject.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION: Get all subjects for the specific user ---
const getSubjects = async (req, res) => {
    try {
        const userId = req.user.id;

        // We simple select all subjects that belong to this user ID
        const subjects = await pool.query(
            'SELECT * FROM subjects WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        res.json(subjects.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION: Update attendance counts ---
const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params; // The Subject ID from the URL
        const { total_classes, attended_classes } = req.body;
        const userId = req.user.id;

        // We update the subject ONLY if it belongs to the logged-in user (AND user_id = $4)
        // This prevents users from messing with other people's data
        const updateSubject = await pool.query(
            'UPDATE subjects SET total_classes = $1, attended_classes = $2 WHERE subject_id = $3 AND user_id = $4 RETURNING *',
            [total_classes, attended_classes, id, userId]
        );

        if (updateSubject.rows.length === 0) {
            return res.status(404).json({ msg: 'Subject not found or not authorized' });
        }

        res.json(updateSubject.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    addSubject,
    getSubjects,
    updateAttendance,
};