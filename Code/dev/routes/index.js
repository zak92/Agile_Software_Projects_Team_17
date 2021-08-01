const express = require('express');

const router = express.Router();
var db = require('../db');

router.get("/",function(req, res){

  let sql1 = 'SELECT RANK() OVER( ORDER BY a.score DESC) AS rank, a.* FROM (SELECT username, IFNULL(contribution, 0), IFNULL(upvotes, 0), IFNULL(ROUND(upvotes*0.5 + contribution*0.5,0), 0) AS score FROM users LEFT JOIN (SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages) AS records GROUP BY fk_user_id) AS total ON user_id = fk_user_id ORDER BY score DESC) AS a LIMIT 5;'

  db.all(sql1,function(error,results){
    if(error){
      res.render("index", {
        user: req.user,
        title:"Site Title",
        message:"DB ERROR",
        results:[]
      });
      return;
    }

    if(results.length <= 0) {
      res.render("index",{
        user: req.user,
        title:"Site Title",
        message:"NO DATA",
        results:[]
      });
      return;
    }
    
    let data = results.map(result => {
      return Object.values(result)
    })
    
    res.render("index", {
      user: req.user,
      title:"Site Title",
      message:false,
      results:data
    });
  });
});

router.get("/javascript",function(req, res){
  res.render("javascript", {
    title: "Javascript Snippets",
    user: req.user 
  });
});


router.get("/search", function(req, res){

  let searchTermMain = req.query.search 

  // Probably not the best way, but this main method synchronously searches multiple tables in the database and then returns 
  // the results. The use of async/await is to get sqlite3 to be synchronous instead of asynchronous.
  async function main() {
    async function languages(searchTerm){
      let language = `language LIKE '%${searchTerm}%'`
      let title = `title LIKE '%${searchTerm}%'`
      let description = `description LIKE '%${searchTerm}%'`
      let tags = `tags LIKE '%${searchTerm}%'`
    
      let sql = `SELECT * FROM languages WHERE ${language} OR ${title} OR ${description} OR ${tags}  ORDER BY language`;
    
      return new Promise(function(resolve,reject){
          db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
          });
      });
    }

    async function frameworks(searchTerm){
      let framework = `framework LIKE '%${searchTerm}%'`
      let title = `title LIKE '%${searchTerm}%'`
      let description = `description LIKE '%${searchTerm}%'`
      let tags = `tags LIKE '%${searchTerm}%'`
    
      let sql = `SELECT * FROM frameworks WHERE ${framework} OR ${title} OR ${description} OR ${tags}  ORDER BY framework`;
    
      return new Promise(function(resolve,reject){
          db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
          });
      });
    }

    async function tools(searchTerm){
      let framework = `tool LIKE '%${searchTerm}%'`
      let title = `title LIKE '%${searchTerm}%'`
      let description = `description LIKE '%${searchTerm}%'`
      let tags = `tags LIKE '%${searchTerm}%'`
    
      let sql = `SELECT * FROM tools WHERE ${framework} OR ${title} OR ${description} OR ${tags}  ORDER BY tool`;
    
      return new Promise(function(resolve,reject){
          db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
          });
      });
    }

    try {
      let languageResults = await languages(searchTermMain);
      let frameworksResults = await frameworks(searchTermMain);
      let toolsResults = await tools(searchTermMain);
      
      let formattedLanguageResults = languageResults.map(result => {
        return Object.values(result)
      })

      let formattedFrameworksResults = frameworksResults.map(result => {
        return Object.values(result)
      })

      let formattedToolsResults = toolsResults.map(result => {
        return Object.values(result)
      })

      res.render("search", {
        title: "Search",
        message: false,
        languages: formattedLanguageResults,
        frameworks: formattedFrameworksResults,
        tools: formattedToolsResults,
        user: req.user
      });

    } catch (error) {
      console.log(error);
        res.render("index", {
          user: req.user,
          title:"Site Title",
          message:"DB ERROR",
          results:[]
        });
    }

}

main()

  
});

router.get("/ranking",function(req,res){

  let sql1 = 'SELECT RANK() OVER( ORDER BY a.score DESC) AS rank, a.* FROM (SELECT username, IFNULL(contribution, 0), IFNULL(upvotes, 0), IFNULL(ROUND(upvotes*0.5 + contribution*0.5,0), 0) AS score FROM users LEFT JOIN (SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages) AS records GROUP BY fk_user_id) AS total ON user_id = fk_user_id ORDER BY score DESC) AS a;'

  db.all(sql1,function(error,results){
    if(error){
      res.render("progress", {
        user: req.user
      });
      return;
    }

    if(results.length <= 0) {
      res.render("ranking",{
        user: req.user,
        title: "User Rankings",
        message: "No data",
        results: []
      });
      return;
    }
    
    let data = results.map(result => {
      return Object.values(result)
    })

    res.render("ranking", {
      user: req.user,
      title: "User Rankings",
      message: false,
      results: data
    });
  });
});

router.get("/progress", function(req, res){
  res.render("progress",{
    user: req.user
  });
});


module.exports = router;