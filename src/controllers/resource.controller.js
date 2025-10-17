// src/controllers/resource.controller.js
const pool = require('../config/db');

const createResource = async (req, res) => {
    const { title, description, resource_type, resource_url } = req.body;
    
    const userId = req.user.id;

    
    if (!title || !resource_type || !resource_url) {
        return res.status(400).json({ msg: 'Please provide a title, type, and URL' });
    }

    try {
        const newResource = await pool.query(
            'INSERT INTO resources (user_id, title, description, resource_type, resource_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, title, description, resource_type, resource_url]
        );

        res.status(201).json(newResource.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createResource,
};