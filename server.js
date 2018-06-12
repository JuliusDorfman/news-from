// Require Framework and Database
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
// Body Parser to work with data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Routes
const cnnProvider = require('./src/providers/cnnProvider');
const breitbartProvider = require('./src/providers/breitbartProvider');
const msnbcProvider = require('./src/providers/msnbcProvider');
const foxProvider = require('./src/providers/foxProvider');
const cnnArticles = require('./routes/api/cnnArticles');
const foxArticles = require('./routes/api/foxArticles');
const breitbartArticles = require('./routes/api/breitbartArticles');
const msnbcArticles = require('./routes/api/msnbcArticles');
const allArticles = require('./routes/api/allArticles');

app.use('/routes/api/cnnArticles', cnnArticles);
app.use('/routes/api/foxArticles', foxArticles);
app.use('/routes/api/breitbartArticles', breitbartArticles);
app.use('/routes/api/msnbcArticles', msnbcArticles);
app.use('/routes/api/allArticles', allArticles)
app.use('/api/cnn', cnnProvider);
app.use('/api/breitbart', breitbartProvider);
app.use('/api/msnbc', msnbcProvider);
app.use('/api/fox', foxProvider);

// Serve static assets 	if in production
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	});
}

// Database Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB mLab
mongoose
	.connect(db)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log('Error Connecting to Database: ' + err));

// Listen on Port for changes
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server listening on port: ${port}`);
});
