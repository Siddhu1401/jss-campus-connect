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


const getAllResources = async (req, res) => {
    try {
        // We select all resources and join with the users table to get the uploader's name
        const allResources = await pool.query(
            `SELECT r.*, u.name as uploader_name 
             FROM resources r 
             JOIN users u ON r.user_id = u.user_id 
             ORDER BY r.created_at DESC`
        );

        res.json(allResources.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getResourceById = async (req, res) => {
    try {
        // We get the ID from the URL parameters (e.g., /api/resources/some-uuid)
        const { id } = req.params;

        const resource = await pool.query(
            `SELECT r.*, u.name as uploader_name 
             FROM resources r 
             JOIN users u ON r.user_id = u.user_id 
             WHERE r.resource_id = $1`,
            [id]
        );

        // Check if we actually found a resource
        if (resource.rows.length === 0) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        res.json(resource.rows[0]);

    } catch (err) {
        console.error(err.message);
        // This check handles cases where the ID is not a valid UUID format
        if (err.code === '22P02') {
             return res.status(404).json({ msg: 'Resource not found (invalid ID)' });
        }
        res.status(500).send('Server Error');
    }
};

const deleteResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const userId = req.user.id; 
        
        const resource = await pool.query(
            'SELECT user_id FROM resources WHERE resource_id = $1',
            [resourceId]
        );

        
        if (resource.rows.length === 0) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        const resourceOwnerId = resource.rows[0].user_id;

        if (resourceOwnerId !== userId) {
            return res.status(401).json({ msg: 'User not authorized to delete this resource' });
        }

        await pool.query('DELETE FROM resources WHERE resource_id = $1', [resourceId]);

        res.json({ msg: 'Resource removed successfully' });

        } 
       
        catch (err) {
        console.error(err.message);
        
        if (err.code === '22P02') {
             return res.status(404).json({ msg: 'Resource not found (invalid ID)' });
        }
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createResource,
    getAllResources,
    getResourceById,
    deleteResource,
};