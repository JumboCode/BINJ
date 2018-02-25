const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
const http = require('http').Server(app);
const stories = require('./routes/storyRoutes');
const accounts = require('./routes/accountRoutes');

const cookieParser = require('cookie-parser');
const session = require('express-session');

// Enabling CORS:
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'keyboard cat' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/stories', stories);
app.use('/account', accounts);

// passport config
var Account = require('./models/accountModel');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

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

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/account/login');
}

app.get('/', function(req, res){
	res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.get('/admin', /*ensureAuthenticated,*/ function(req, res) {
	res.sendFile('edit.html', {root: path.join(__dirname, 'public')});
});

app.post('*', function(req, res) {
	console.log(req.url.substring(1));
	res.send("200")
});

/*
 * Guesses which image url could be used from news article page.
 *
 * To use:
 * https://binj-map.herokuapp.com/imgurl?url=https://website.com
 */
app.get('/imgurl', function (req, res) {
	var url = req.query.url;
    url = (url.substring(0,4) == "http") ? url : "https://" + url;

    if (url.indexOf("digboston.com") != -1) {
        var digboston = true;
    } else {
        var digboston = false;
    }

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var src = "";
            var i = 0;

            // custom filter for digboston pages
            if (digboston) {
                limit = 0
                src = $('img').filter('.size-full').attr("src");
            } else {
                limit = 2
                $('img').filter(function() {
                    if (i == 2) {
                        src = $(this).data.attr("src");
                    }
                    i++;
                });
            }

            if (src == "") {
            	return res.sendStatus(400);
            }
            return res.send(src);
        } else {
            return res.sendStatus(400);
        }
    });
});


app.get('/newStory', /*ensureAuthenticated,*/ function(req, res){

	res.sendFile('admin.html', {root: path.join(__dirname, 'public')});
});

app.get('/map', function(req, res){

	res.sendFile('map.html', {root: path.join(__dirname, 'public')});
});

http.listen(process.env.PORT || 3000, function() {
  	console.log('Node app is running on port 3000');
});
