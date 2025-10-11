// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./config/db');

// This allows our app to accept JSON data from the client
app.use(express.json());

// This block confirms our database is connected on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DATABASE CONNECTION FAILED:', err.stack);
    } else {
        console.log('Database connected successfully.');
    }
});

const PORT = process.env.PORT || 5000;

// A simple route to check if the API is running
app.get('/', (req, res) => {
    res.send('JSS Campus Connect API is running...');
});

// This line connects all our user-related routes
app.use('/api/users', require('./api/user.routes.js'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});