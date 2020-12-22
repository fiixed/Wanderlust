const Post = require('../models/post');
const passport = require('passport');
const genericController = require('../controllers/generic');

exports.new = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('compose', { user: genericController.userName(req) });
    } else {
        res.redirect('/auth/login');
    }
};

exports.create = (req, res) => {
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
};

exports.findOne = (req, res) => {
    Post.findOne({ _id: req.params.postId }, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            console.log(post);
            res.render('post', {
                title: post.title,
                content: post.content,
                user: genericController.userName(req)
            });
        }

    });
};

exports.replaceOne = (req, res) => {
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
};

exports.editOne = (req, res) => {
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
};

exports.deleteOne = (req, res) => {
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
};

exports.findAll = (req, res) => {
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
};

exports.deleteAll = (req, res) => {
    Post.deleteMany({}, (err) => {
        if (!err) {
            res.send("Successfully deleted all posts");
        } else {
            res.send(err);
        }
    });
};

