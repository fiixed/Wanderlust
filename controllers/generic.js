const passport = require('passport');

exports.userName = (req, res) => {

    if (req.isAuthenticated()) {
        return req.user.username;
    } else {
        return '';
    }
};