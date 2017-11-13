const path = require('path');
const passport = require('passport');
var Account = require('../models/accountModel');

module.exports = {

    loginpage: function(req, res) {
        res.sendFile('login.html', {root: path.join(__dirname, '../public')});
    },

    login: function(req, res) {
        res.send('{"message":"logged on!"}')
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    },

    registerpage: function(req, res) {
        res.sendFile('register.html', {root: path.join(__dirname, '../public')});
    },

    register: function(req, res) {
        /* This barrier is currently disabled, route open for any registered user. 
         *
         * Route is only open if an environment variable DEV_MODE 
         * was set to 'true' (String, not boolean).
         */
        /*if (process.env.DEV_MODE != "true") {
            res.sendStatus(403);
        } else { */

        Account.findOne({username: req.body.username}, function(err, user){ 
            if (err) {
                res.send(500);
            } else if (user) {
                res.send('{"error":"Username taken. Try a different one."}');
            } else {
                Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
                    if (err) {
                        res.send(500); 
                    }
                    passport.authenticate('local')(req, res, function () {
                        res.sendStatus(200);
                    });
                });
            }
        });
    },

    server: function(req, res) {
        res.send("you are authenticated");
    }

}
