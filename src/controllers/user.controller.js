// src/controllers/user.controller.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // A simple check to ensure we received all the data we need
    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // First, check if a user with that email is already in the database
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'A user with this email already exists' });
        }

        // If the user is new, we securely hash their password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Now, we insert the new user's data into the table
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role',
            [name, email, hashedPassword, role]
        );

        // Finally, send a success response back to the client
        res.status(201).json({
            msg: 'User registered successfully!',
            user: newUser.rows[0],
        });

    } catch (err) {
        // If anything goes wrong in the 'try' block, this will catch the error
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // A quick check to make sure both fields were sent
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide an email and password' });
    }

    try {
        // First, find the user in the database by their email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        // If we didn't find a user, the credentials are invalid
        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // Now, compare the password they sent with the hashed password in our database
        const isMatch = await bcrypt.compare(password, user.password);

        // If the passwords don't match, the credentials are invalid
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // If everything is correct, create a payload for the token
        const payload = {
            user: {
                id: user.user_id,
                name: user.name,
                role: user.role,
            },
        };

        // Sign the token with your secret key, making it official
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // The token will be valid for 5 hours
            (err, token) => {
                if (err) throw err;
                // Finally, send the token back to the user
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Make sure to export the new function
module.exports = {
    registerUser,
    loginUser,
};