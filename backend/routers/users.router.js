const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const userValidationMiddleware = require('../middleware/userValidation.middleware');
const ipCheckMiddleware = require('../middleware/ipCheck.middleware');
router.post(
	'/register',
	ipCheckMiddleware.ipRequestCheck,
	userValidationMiddleware.userValidation,
	userController.registerUser
);

module.exports = router;
