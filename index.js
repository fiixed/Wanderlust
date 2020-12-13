require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('connect-flash');
const User = require('./models/user');
const Post = require('./models/post');

const aboutContent = 'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent = 'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(flash());
app.use(session({
  secret: 'Our little secret.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/wanderlustDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  res.render('home');
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

  User.register({ username: req.body.username }, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect('register');
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('secrets');
      });
    }
  });
});

app.route('/secrets').get((req, res) => {
  if (req.isAuthenticated()) {
    Post.find({}, (err, posts) => {
      res.render('secrets', {
        posts: posts
      });
    });
  } else {
    res.redirect('/login');
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

// app.route('/login').get((req, res) => {
//   res.render('login');
// }).post((req, res) => {
//   const user = new User({
//     username: req.body.username,
//     password: req.body.password
//   });

//   req.login(user, (err) => {
//     if (err) {
//       res.redirect('/login');
//     } else {
//       passport.authenticate('local')(req, res, () => {
//         res.redirect('/secrets');
//       });
//     }
//   });
// });



app.get("/login", function (req, res) {
  res.render("login");
});

// Login Logic
// middleware
app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login",
  failureFlash: 'Invalid username or password.'
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Set Port
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});