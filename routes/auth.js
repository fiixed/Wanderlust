const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/wanderlust',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/posts/secrets');
    });

router.route('/register').get((req, res) => {
    res.render('register', { user: userName(req) });
}).post((req, res) => {

    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/posts/secrets');
            });
        }
    });
});

router.get("/login", function (req, res) {
    res.render("login", { user: userName(req) });
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/posts/secrets",
    failureRedirect: "/login",
    failureFlash: 'Invalid username or password.'
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

const userName = (req) => {
    if (req.isAuthenticated()) {
        return req.user.username;
    } else {
        return '';
    }
};

module.exports = router;