const express = require("express");
const authController = require('../controllers/auth/auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

module.exports = router