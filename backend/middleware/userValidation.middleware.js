const validators = require('../util/validators');
const User = require('../models/user.model');
const userValidation = (req, res, next) => {
	const { name, email, password } = req.body;
	if (name && email && password) {
		if (
			validators.nameValidator(name) &&
			validators.emailValidator(email) &&
			validators.passwordValidator(password)
		) {
			User.findOne({ email: email }, (err, resultUser) => {
				if (err) {
					console.log('Inside err', err);
					return res.status(500).json({
						userRegistered: true,
						showRecaptcha: false,
						error: 'Internal Server Error!'
					});
				} else if (resultUser) {
					return res.status(500).json({
						userRegistered: true,
						showRecaptcha: false,
						error: 'User Already Exists!'
					});
				}
				next();
			});
		} else {
			return res.status(500).json({
				userRegistered: true,
				showRecaptcha: false,
				error: 'Validation Falied!'
			});
		}
	} else {
		return res.status(500).json({
			userRegistered: true,
			showRecaptcha: false,
			error: 'Name, Email, Passsword are required fields.'
		});
	}
};

module.exports = { userValidation };
