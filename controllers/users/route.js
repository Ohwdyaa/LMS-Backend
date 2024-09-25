const express = require('express');
const {
    loginHandler, 
    createUserHandler } = require('./handler'); 
const router = express.Router();

router.post('/create_user', createUserHandler);
router.post('/login', loginHandler);

module.exports = router;