const express = require('express');
const {
    loginHandler, 
    createUserHandler } = require('./handler'); 
const { checkRoles } = require('../../middlewares/auth');
const router = express.Router();



router.post('/create_user', checkRoles(['admin']), createUserHandler);
router.post('/login', loginHandler);

module.exports = router;