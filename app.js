var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport); // Load Passport config


var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoStore = require('connect-mongo');

var hbs = require('hbs');
var db = require('./config/db');
var cors = require('cors');
require('dotenv').config({ path: 'dbconfig.env' })
// console.log("Loaded Environment Variables:", process.env);
var homeRouter = require('./component/home/homeRoute');
var userRouter = require('./component/user/userRoute');
var productRouter = require('./component/product/productRoute');

const dbconfig = {
  url: process.env.DB_URL || ""

  
}
db.connect(dbconfig.url);

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


hbs.registerPartials(__dirname + '/views/partials', function (err) {});
hbs.registerHelper('limit', function (text, limit) {
  if (text && text.length > limit) {
      return text.substring(0, limit) + '...';
  }
  return text;
});
app.use(session({
  secret: 'qwertyuiop',  // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbconfig.url,
    collectionName: 'sessions'
  }),
  cookie: { secure: false } // Set to true if using HTTPS
}));




// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Passport.js provides req.user if authenticated
  next();
});

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routers

app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/glasses', productRouter);
app.use("/auth", userRouter);
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google to redirect to
app.get(
    '/auth/google/callback',
    (req, res, next) => {
      console.log('Google callback route hit!');
      next();
    },
    passport.authenticate('google', { failureRedirect: '/user/login' }),
    (req, res) => {
      console.log('Authentication successful');
      res.redirect('/home/about');
    }
  );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var port = 3001;
app.listen(port, () => {
  console.log('Listening...')
})