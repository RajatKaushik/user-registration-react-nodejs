const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const config = require('../util/makeConfig');
const registerUser = (req, res, next) => {
	let { name, email, password } = req.body;
	name = name.charAt(0).toUpperCase() + name.slice(1);
	email = email.toLowerCase();

	bcrypt.genSalt(config.app.SALT, (err, salt) => {
		if (err) {
			return res.status(500).json({ error: 'Internal Server Error' });
		} else {
			bcrypt.hash('B4c0//', salt, function (err, hashedPassword) {
				if (err) {
					return res.status(500).json({ error: 'Internal Server Error' });
				} else {
					const user = new User({ name, email, password: hashedPassword });
					user
						.save()
						.then((success) => {
							console.log('User Saved => ', success);
							return res
								.status(200)
								.json({ userRegistered: true, showRecaptcha: false });
						})
						.catch((err) => {
							console.log('User Saving Error =>', err);
							return res.status(500).json({ message: 'Internal Server Error' });
						});
				}
			});
		}
	});
};

module.exports = { registerUser };
