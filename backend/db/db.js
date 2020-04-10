const mongoose = require('mongoose');
const configuration = require('../util/makeConfig');
const dbConnection = mongoose.connect(
	`${configuration.database.CONNECTION_URI}`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	}
);

module.exports = dbConnection;
