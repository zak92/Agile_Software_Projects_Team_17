const express = require("express"); 
const routes = require('./routes/index');
const path = require("path")
const bodyParser = require('body-parser');

//create an instance of the express module
const app = express();

//setup view engine
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

//for express to reference to public folder for static files
app.use(express.static(__dirname + "/public"));


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

module.exports = app;