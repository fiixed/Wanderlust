require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;



const homeStartingContent = 'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.';
const aboutContent = 'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent = 'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wanderlustDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const User = new mongoose.model('User', userSchema);

const Post = new mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.route('/secrets').get((req, res) => {
  Post.find({}, (err, posts) => {
    res.render('secrets', {
      posts: posts
    });
  });
}).delete((req, res) => {
  Post.deleteMany({}, (err) => {
    if (!err) {
      res.send("Successfully deleted all posts");
    } else {
      res.send(err);
    }
  });
});

app.get('/about', (req, res) => {
  res.render('about', { startingContent: aboutContent });
});

app.get('/contact', (req, res) => {
  res.render('contact', { startingContent: contactContent });
});

app.route('/compose').get((req, res) => {
  res.render('compose');
}).post((req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save((err) => {
    if (!err) {
      res.redirect('/secrets');
    }
  });
});

app.route('/posts/:postId').get((req, res) => {
  Post.findOne({ _id: req.params.postId }, (err, post) => {
    res.render('post', {
      title: post.title,
      content: post.content
    });
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

app.route('/register').get((req, res) => {
  res.render('register');
}).post((req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('secrets');
      }
    });
  });
});

app.route('/login').get((req, res) => {
  res.render('login');
}).post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (result === true) {
            res.redirect('secrets');
          }
        });
      }
    }
  });
});

// Set Port
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});