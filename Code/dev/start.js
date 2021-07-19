const app = require('./app');
const mysql = require("mysql2");


//establish db connection
const db = mysql.createConnection ({ host: "localhost",
  user: "root",
  password: "Z@mysqluser13749", //insert password
  database: "coding_knowledge_db" }); // insert database name
  db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
  });
