const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);

// Initialize mongo
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/binj';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.get('/', function(req, res){
	db.collection("nonsense", function(error, collection){
		collection.insert( {"visited" : 1} )
	});

	res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.get('/admin', function(req, res){
	res.sendFile('admin.html', {root: path.join(__dirname, 'private')});
});

http.listen(process.env.PORT || 3000, function() {
  	console.log('Node app is running on port 3000');
});
