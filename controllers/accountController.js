const path = require('path');
const passport = require('passport');
var Account = require('../models/accountModel');

module.exports = {

    loginpage: function(req, res) {
        res.sendFile('login.html', {root: path.join(__dirname, '../public')});
    },

    login: function(req, res) {
        res.send("logged on!")
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    },

    register: function(req, res) {
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
    },

    server: function(req, res) {
        res.send("you are authenticated");
    }

}
