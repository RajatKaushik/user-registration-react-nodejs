const configuration = require('./makeConfig');

const axios = require('axios').default;

const verifyReCaptcha = (siteReCaptchaResponse) => {
	return axios.post(
		`https://www.google.com/recaptcha/api/siteverify?secret=${configuration.app.RECAPTCHA_SECRET}&response=${siteReCaptchaResponse}`
	);
};

module.exports = verifyReCaptcha;
