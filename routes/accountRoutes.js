const express = require('express');
const passport = require('passport');
var router = express.Router();
var accountController = require('../controllers/accountController.js');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/account/login');
}

/* temporary solution for testing : */
router.get('/login', accountController.loginpage);

router.post('/login', passport.authenticate('local'), accountController.login);

router.get('/logout', accountController.logout);

router.post('/register', accountController.register);

router.get('/server', ensureAuthenticated, accountController.server);

module.exports = router;
