const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const middlewares = require('./middlewares');
const logRoutes = require('./routes/logRoutes');

const app = express();

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(morgan('dev'));
app.use(helmet());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
	}),
);
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api', logRoutes);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`listening on port ${port}...`);
});
