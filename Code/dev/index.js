//import node libraries
const express = require("express"); 
const mysql = require("mysql2");
const path = require("path")

//create an instance of the express module
const app = express();
const port = 8083;


require("./routes/main")(app);

//establish db connection
const db = mysql.createConnection ({ host: "localhost",
  user: "root",
  password: "", //insert password
  database: "coding_knowledge_db" }); // insert database name
  db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

//for express to reference to public folder for static files
app.use(express.static(__dirname + "/public"));

//setup view engine
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

//for express to reference to bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
)
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
)
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")))

//log server is running
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
