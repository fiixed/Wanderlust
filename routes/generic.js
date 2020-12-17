const express = require('express');
const router = express.Router();
const passport = require('passport');



const userName = (req) => {
    if (req.isAuthenticated()) {
        return req.user.username;
    } else {
        return '';
    }
};