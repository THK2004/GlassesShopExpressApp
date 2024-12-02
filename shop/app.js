var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./config/db/passport');
var MongoStore = require('connect-mongo');
var hbs = require('hbs');
var mongoose = require('mongoose');
var db = require('./config/db');
var cors = require('cors');
require('dotenv').config({ path: 'dbconfig.env' })

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'qwertyuiop',  // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbconfig.url,
    collectionName: 'session'
  }),
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));
//app.use(passport.authenticate('session'));

app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/glasses', productRouter);

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