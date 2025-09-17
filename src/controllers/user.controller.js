// src/controllers/user.controller.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    
    const { name, email, password, role } = req.body;

    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    
    if (role !== 'student' && role !== 'teacher') {
        return res.status(400).json({ msg: 'Invalid user role' });
    }

    try {
        
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'A user with this email already exists' });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role',
            [name, email, hashedPassword, role]
        );

       
        res.status(201).json({
            msg: 'User registered successfully!',
            user: newUser.rows[0],
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// We export the function so our route file can use it
module.exports = {
    registerUser,
};