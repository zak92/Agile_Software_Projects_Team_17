const express = require('express');

const router = express.Router();
var db = require('../db');

router.get("/",function(req, res){
  res.render("index", {
    title: "Site Title",
    user: req.user 
  });
});

router.get("/javascript",function(req, res){
  res.render("javascript", {
    title: "Javascript Snippets",
    user: req.user 
  });
});


router.get("/search",function(req, res){

  let searchTerm = req.query.search 
  // Search db for code snippets based on search query
  db.get('SELECT * from languages WHERE title like ?', '%' + searchTerm + '%', function (error, results, fields) {
    if (error) {
        res.render("progress", {
          user: req.user
        });
    }

    if (results.length <= 0) {
        res.render("search", {
          title: "Search",
          message: 'No results found',
          results: [],
          user: req.user
        });
        return;
    }

    let data = results.map(result => {
        return Object.values(result)
    })

    res.render("search", {
      title: "Search",
      message: false,
      results: data,
      user: req.user 
    });
  });
});

router.get("/ranking",function(req,res){

  let sql1 = 'SELECT  (@rank:= @rank + 1) AS rank_no, a.* FROM (SELECT username, contribution, upvotes, ROUND(upvotes*0.5 + contribution*0.5,0) AS score FROM (SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages) AS records GROUP BY fk_user_id) AS total LEFT JOIN users ON user_id = fk_user_id ORDER BY score DESC) AS a , (SELECT @rank:= 0) AS b LIMIT 5'

  db.get(sql1,function(error,results){
    if(error){
      res.render("progress", {
        user: req.user
      });
      return;
    }

    if(results.length <= 0) {
      res.render("ranking",{
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