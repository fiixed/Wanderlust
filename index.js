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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const aboutContent = 'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent = 'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(flash());
app.use(session({
  secret: process.env.SESSION,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/wanderlustDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/wanderlust'
},
  function (accessToken, refreshToken, profile, email, cb) {
    console.log(email._json.email);
    User.findOrCreate({ username: email._json.email }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', (req, res) => {
  res.render('home', { user: userName(req) });
});

app.get('/about', (req, res) => {
  res.render('about', { startingContent: aboutContent, user: userName(req) });
});

app.get('/contact', (req, res) => {
  res.render('contact', { startingContent: contactContent, user: userName(req) });
});
// Routes 
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);





// Set Port
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});

const userName = (req) => {
  if (req.isAuthenticated()) {
    return req.user.username;
  } else {
    return '';
  }
};