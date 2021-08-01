const express = require('express');

const router = express.Router();
var db = require('../db');
var mainSearch = require('../modules/search');

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
  mainSearch.search(req, res, req.query.search)
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