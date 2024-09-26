const express = require('express');
const { authenticate } = require('./auth'); 
const router = express.Router();

router.get('/protected-route', authenticate, (req, res) => {
    res.json({ message: `Hello, ${req.user.email}! You are authorized.` });
});

module.exports = router;