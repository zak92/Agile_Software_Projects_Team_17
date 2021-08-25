const express = require("express"); 
var passport = require('passport');
const path = require("path")
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
// var authRouter = require('./routes/auth');
// var myaccountRouter = require('./routes/myaccount');
// var usersRouter = require('./routes/users');

//create an instance of the express module
const app = express();
const port = 3000;

require('./boot/auth')();

//setup view engine
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
app.use(passport.initialize());
app.use(passport.authenticate('session'));


//for express to reference to public folder for static files
app.use(express.static(__dirname + "/public"));


//define routes
app.use('/', indexRouter);
// app.use('/', authRouter);
// app.use('/myaccount', myaccountRouter);
// app.use('/users', usersRouter);
app.use("/css", express.static(path.join(__dirname, "public/css")))
app.use("/js", express.static(path.join(__dirname, "public/js")))

// redirect all 404 to progress
app.use(function(req, res) {
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    res.render("progress",{
      user: req.user
    });
    return;
  };
});

app.listen(port, () => console.log(`Express is running on port ${port}!`));

module.exports = app;