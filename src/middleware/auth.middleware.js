// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // A token is usually sent in the 'Authorization' header in the format 'Bearer <token>'
    const authHeader = req.header('Authorization');

    // If there's no Authorization header, the user isn't authenticated
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // The header looks like "Bearer eyJhbGciOi...", so we split it and take the second part
        const token = authHeader.split(' ')[1];

        // If there's no token after "Bearer ", it's a bad format
        if (!token) {
            return res.status(401).json({ msg: 'Token format is invalid' });
        }

        // Now we verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // The token is valid! We attach the user's info (from the token's payload) to the request object.
        // This makes the user's data available to any protected route that comes next.
        req.user = decoded.user;

        // We call next() to pass control to the next function in the chain (the actual route handler)
        next();
    } catch (err) {
        // If jwt.verify fails, it will throw an error that we catch here
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;