const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const stories = require('./routes/storyRoutes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/stories', stories);

// Initialize mongo
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/binj';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var mongoose = require('mongoose');
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

mongoose.connect(mongoUri, err => {
    if (err) 
        console.log(err);
    else
        console.log("connected");
});

app.get('/', function(req, res) {
	res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.get('/admin', function(req, res) {
	res.sendFile('admin.html', {root: path.join(__dirname, 'public')});
});

http.listen(process.env.PORT || 3000, function() {
  	console.log('Node app is running on port 3000');
});