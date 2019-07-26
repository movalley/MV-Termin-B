var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


var chalk = require('chalk');

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRoute = require('./routes/profile');

let mongoPass = process.env.MongoPass

mongoose.connect(`mongodb+srv://Mario:${mongoPass}@astriddb-m3oau.mongodb.net/termin?retryWrites=true&w=majority`, {
  useNewUrlParser: true
}, (err) => {
  console.log(err)
})

mongoose.connection.on('connected', function(){
  console.log(connected("Mongoose default connection is open to terminDB"));
});

mongoose.connection.on('error', function(err){
  console.log(error("Mongoose default connection has occured "+err+" error"));
});

mongoose.connection.on('disconnected', function(){
  console.log(disconnected("Mongoose default connection is disconnected"));
});

setTimeout(() => {
    console.log(mongoose.connection.readyState)
}, 5000);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', usersRouter);

// auth middleware
app.use((req,res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
      jwt.verify(token, process.env.SuperSecret, (err, decoded) => {
          if(err) {
              return res.status(401).json({ message: 'Fail to authenticate token. You shall not pass!'});
          } else {
              req.decoded = decoded;
              next();
          }
      });
  } else {
      return res.status(401).send({
          message: 'No token provided. You shall not pass!'
      });
  }
})

app.use('/profile', profileRoute);

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
