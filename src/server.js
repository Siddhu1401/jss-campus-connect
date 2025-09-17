
require('dotenv').config();

const express = require('express');
const app = express();
const pool = require('./config/db');

app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DATABASE CONNECTION FAILED:', err.stack);
    } else {
        console.log('Database connected successfully.');
    }
  });    

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('JSS Campus Connect API is running...');
});

app.use('/api/users', require('./api/user.routes.js'));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});