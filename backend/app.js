const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressip = require('express-ip');
const config = require('./util/makeConfig');
const usersRouter = require('./routers/users.router');

const app = express();

const dbConnection = require('./db/db');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressip().getIpInfoMiddleware);

app.use('/api/users', usersRouter);

app.listen(config.app.PORT || 4200, (args) => {
	dbConnection
		.then(() => {
			console.log('Successfully Connected to Database');
		})
		.catch((err) => {
			console.log('DataBase Connection failed', err);
		});
});
