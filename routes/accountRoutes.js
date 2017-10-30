const express = require('express');
const passport = require('passport');
const path = require('path');
var Account = require('../models/accountModel');
var router = express.Router();

/* temporary solution for testing : */
router.get('/login', function(req, res) {
    res.sendFile('login.html', {root: path.join(__dirname, '../public')});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
	console.log("logging in")
    //res.redirect('/');
    console.log(req.user);
    res.send("logged on!")
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.sendStatus(500);
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/account/login');
}

router.get('/server', ensureAuthenticated, function(req, res) {
    res.send("On");
});

module.exports = router;