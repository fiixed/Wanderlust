const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const passport = require('passport');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

router.route('/compose').get((req, res) => {
    if (req.isAuthenticated()) {
        res.render('compose', { user: userName(req) });
    } else {
        res.redirect('/auth/login');
    }

}).post((req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody,
        userId: req.user.id
    });

    post.save((err) => {
        if (!err) {
            res.redirect('/posts/secrets');
        }
    });
});

router.route('/post/:postId').get((req, res) => {
    Post.findOne({ _id: req.params.postId }, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            console.log(post);
            res.render('post', {
                title: post.title,
                content: post.content,
                user: userName(req)

            });
        }

    });
}).put((req, res) => {
    Post.update(
        { _id: req.params.postId },
        {
            title: req.body.title,
            content: req.body.content
        },
        { overwrite: true },
        (err) => {
            if (!err) {
                res.send('replaced post');
            }
        });
}).patch((req, res) => {
    Post.update(
        { _id: req.params.postId },
        { $set: req.body },
        (err) => {
            if (!err) {
                res.send('updated post');
            } else {
                res.send(err);
            }
        });
}).delete((req, res) => {
    Post.deleteOne(
        { _id: req.params.postId },
        (err) => {
            if (!err) {
                res.send('deleted post');
            }
        }
    );
});


router.route('/secrets').get((req, res) => {
    if (req.isAuthenticated()) {
        Post.find({ userId: req.user.id }, (err, posts) => {
            res.render('secrets', {
                posts: posts,
                user: req.user.username
            });
        });
    } else {
        res.redirect('/auth/login');
    }

}).delete((req, res) => {
    Post.deleteMany({}, (err) => {
        if (!err) {
            res.send("Successfully deleted all posts");
        } else {
            res.send(err);
        }
    });
});

const userName = (req) => {
    if (req.isAuthenticated()) {
        return req.user.username;
    } else {
        return '';
    }
};

module.exports = router;