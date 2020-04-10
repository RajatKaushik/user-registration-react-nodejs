const config = {
	development: {
		configId: 'development',
		database: {
			HOST_NAME: 'localhost',
			DATABASE_NAME: 'ImageKit',
			CONNECTION_URI: `mongodb://localhost/imagekit`
		},
		app: {
			PORT: process.env.PORT || 4200,
			NAME: 'ImageKit-API-Development',
			PASSWORD_SECRET_KEY: 'IMAGEKIT',
			SALT: 7,
			RECAPTCHA_SECRET:
				process.env.RECAPTCH_SECRET ||
				'6LfgYegUAAAAABTa2m5ZaZAQPwcwhtR4fnTvhvaM'
		}
	},

	production: {
		configId: 'production',
		database: {
			USER_NAME: process.env.DATABASE_USER_NAME,
			PASSWORD: process.env.DATABASE_PASSWORD,
			HOST_NAME: process.env.DATABASE_HOST_NAME,
			CONNECTION_URI: `mongodb://${process.env.DATABASE_USER_NAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_PASSWORD}/imagekit`
		},
		app: {
			PORT: process.env.PORT || 4200,
			NAME: 'ImageKit-API-Production',
			PASSWWORD_SECRET_KEY: 'IMAGEKIT',
			SALT: 10,
			RECAPTCHA_SECRET:
				process.env.RECAPTCH_SECRET ||
				'6LfgYegUAAAAABTa2m5ZaZAQPwcwhtR4fnTvhvaM'
		}
	}
};

module.exports = config;
