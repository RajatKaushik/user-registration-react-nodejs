const mongoose = require('mongoose');

const ipRequestSchema = new mongoose.Schema({
	ipAddress: {
		type: String,
		required: true
	},
	numberOfRequests: {
		type: Number,
		required: true
	},
	lastRequestTime: {
		type: Date,
		required: true
	},
	alwaysValidateRecaptcha: {
		type: Boolean,
		required: true,
		default: false
	}
});

const IPRequest = mongoose.model('ipRequest', ipRequestSchema);

module.exports = IPRequest;
