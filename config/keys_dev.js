
const path = require ('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
mongoDBPassword = process.env.MONGO_DB_PASSWORD;

module.exports = {
	mongoURI: 'mongodb+srv://juliusdorfman:' + mongoDBPassword + '@news-from-cluster.mrd9j5e.mongodb.net/?retryWrites=true&w=majority'
}


