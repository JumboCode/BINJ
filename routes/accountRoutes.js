const express = require('express');
const passport = require('passport');
const path = require('path');
var Account = require('../models/accountModel');
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/account/login');
}

/* temporary solution for testing : */
router.get('/login', function(req, res) {
    res.sendFile('login.html', {root: path.join(__dirname, '../public')});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send("logged on!")
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/register', function(req, res) {
    /* Route is only open if an environment variable DEV_MODE 
     * was set to 'true' (String, not boolean).
     */
    if (process.env.DEV_MODE != "true") {
        res.sendStatus(403);
    } else {
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
                return res.sendStatus(500);
            }
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    }
});

router.get('/server', ensureAuthenticated, function(req, res) {
    res.send("you are authenticated");
});

module.exports = router;