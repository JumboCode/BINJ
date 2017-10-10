const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
app.use(bodyParser.urlencoded({extended: true}));

// Initialize mongo
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/binj';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.get('/', function(req, res) {
	res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.post('/name', function(req, res) {
    	var name = req.body.name;
	db.collection("names", function(error, collection){
		collection.insert( {"name" : name} )
	});
	res.send(200);
});

app.get('/name', function(req, res) {
	db.collection("names", function(error, coll) {	    
	    if (error) {
			res.send(500);
	    } else {
			coll.find().toArray(
			    function(err, results) {
					if (err) {
						res.send(500);
					} else {
						console.log(results);
						res.send(results);
					}
				}
			);
		}
	});
});

app.get('/admin', function(req, res) {
	res.sendFile('admin.html', {root: path.join(__dirname, 'private')});
});

http.listen(process.env.PORT || 3000, function() {
  	console.log('Node app is running on port 3000');
});
