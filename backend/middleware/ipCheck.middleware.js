const configuration = require('../config/config');
const verifyReCaptcha = require('../util/verifyReCaptcha');
const IPRequest = require('../models/ipRequest.model');

const ipRequestCheck = (request, response, next) => {
	const ip = request.ipInfo.ip;
	console.log('Ip Address of the Request is =>', ip);
	IPRequest.findOne({ ipAddress: ip })
		.then((foundDoc) => {
			if (foundDoc) {
				console.log(
					'There already exists a document with this requests ip address=>',
					foundDoc
				);
				if (foundDoc.alwaysValidateRecaptcha) {
					console.log('Inside Always validaterecaptch');
					if (request.body.reCaptchaToken) {
						console.log('Recaptch token present');
						verifyReCaptcha(request.body.reCaptchaToken)
							.then((result) => {
								console.log('Validating the Recaptcha token');

								if (result.data.success) {
									console.log('Recaptch Token Varified');
									console.log('Updating the ipAddress Object');
									console.log(`Only updating the "lastRequestTime" only and not numberOfRequests as this 
									request is not for registering user, but for validating the reCaptha Token`);
									foundDoc
										.updateOne({
											lastRequestTime: new Date()
										})
										.then((updatedDoc) => {
											console.log('Ip Address Object saved');
											console.log('NOW REGISTERING THE USER');
											return next();
										})
										.catch(() => {
											return response.status(500).json({
												error: 'Internal Server Error!'
											});
										});
								} else {
									console.log('Recaptch Token Verification Failed');
									console.log('Updating the ipAddress Object');
									foundDoc
										.updateOne({
											lastRequestTime: new Date()
										})
										.then((updatedDoc) => {
											console.log(
												'Sending response to again send a new recaptcha'
											);
											return response.json({
												showRecaptcha: true,
												userRegistration: false
											});
										})
										.catch((err) => {
											return response.status(500).json({
												error: 'Internal Server Error!'
											});
										});
								}
							})
							.catch((err) => {
								return response
									.status()
									.json({ error: 'Internal Server Error' });
							});
					} else {
						foundDoc
							.updateOne({
								lastRequestTime: new Date(),
								numberOfRequests: foundDoc.numberOfRequests + 1
							})
							.then((updatedDoc) => {
								return response.json({
									showRecaptcha: true,
									userRegistration: false
								});
							})
							.catch(() => {
								return response.status(500).json({
									error: 'Internal Server Error!'
								});
							});
					}
				} else {
					console.log(
						'"alwaysCheckRecapctch" is false so checking the date time difference'
					);

					const currentDateObj = new Date();
					const lastRequestTime = foundDoc.lastRequestTime;
					const differenceInHours =
						(currentDateObj.getTime() - lastRequestTime.getTime()) /
						(1000 * 3600);
					console.log(
						'difference in hours from last request to current request is =>',
						differenceInHours
					);

					if (differenceInHours > 24) {
						console.log(
							'As difference is greater than 24 hours so, not checking recaptcha'
						);

						foundDoc
							.updateOne({
								lastRequestTime: new Date(),
								numberOfRequests: foundDoc.numberOfRequests + 1
							})
							.then((updatedDoc) => {
								console.log('And registering the user');
								return next();
							})
							.catch((err) => {
								return response.status(500).json({
									error: 'Internal Server Error!'
								});
							});
					} else {
						console.log(
							'As difference is lesser than 24 hours so, checking if Recaptcha is required or not.'
						);

						if (foundDoc.numberOfRequests >= 3) {
							console.log(
								`As the number of requests from this IP Address are greater than 3 in less than 24 hours.
								So setting "the alwaysValidateRecaptcha" as "true" to test for ReCaptcha 
								in all the future requests from this IP Address`
							);
							foundDoc
								.updateOne({
									alwaysValidateRecaptcha: true,
									lastRequestTime: new Date(),
									numberOfRequests: foundDoc.numberOfRequests + 1
								})
								.then((updatedDoc) => {
									console.log('Asking recaptch token from frontend');

									return response.json({
										showRecaptcha: true,
										userRegistration: false
									});
								})
								.catch((err) => {
									return response.status(500).json({
										error: 'Internal Server Error!'
									});
								});
						} else {
							console.log(
								`As the number of requests from this IP Address are "NOT" greater than 3 in less than 24 hours.
								So directly registering the user`
							);
							foundDoc
								.updateOne({
									lastRequestTime: new Date(),
									numberOfRequests: foundDoc.numberOfRequests + 1
								})
								.then((updatedDoc) => {
									return next();
								})
								.catch((err) => {
									return response.status(500).json({
										error: 'Internal Server Error!'
									});
								});
						}
					}
				}
			} else {
				console.log('This is the first request from this ip address');

				const ipRequest = new IPRequest({
					ipAddress: ip,
					numberOfRequests: 1,
					lastRequestTime: new Date(),
					alwaysValidateRecaptcha: false
				});
				ipRequest
					.save()
					.then((doc) => {
						console.log('The saved IpAdress object is =>', doc);
						console.log('Registering the user now!');
						return next();
					})
					.catch((err) => {
						return response
							.status(500)
							.json({ error: 'Internal Server Error!' });
					});
			}
		})
		.catch((err) => {
			return response.status(500).json({ error: 'Internal Server Error!' });
		});
};

module.exports = { ipRequestCheck };
