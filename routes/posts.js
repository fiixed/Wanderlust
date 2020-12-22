const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const passport = require('passport');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const postsController = require('../controllers/posts');

router.route('/compose').get(postsController.new).post(postsController.create);

router.route('/post/:postId').get(postsController.findOne).put(postsController.replaceOne).patch(postsController.editOne).delete(postsController.deleteOne);

router.route('/secrets').get(postsController.findAll).delete(postsController.deleteAll);

module.exports = router;