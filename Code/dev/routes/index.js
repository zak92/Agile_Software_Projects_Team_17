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

router.get("/addcode",function(req, res){
  res.render("addcode", {
    title: "Add CodeSnippets",
    user: req.user 
  });
});


router.get("/search", function(req, res){ 
  mainSearch.search(req, res, req.query.search)
});

router.get("/ranking",function(req,res){

  //Initialize
  let currentpage = 1;
  let itemlimit = 5;
  let totalpage = 1;


  if(req.query.currentpage){
    currentpage = req.query.currentpage;
  }

  if(req.query.itemlimit){
    itemlimit = req.query.itemlimit;
  }

  let sql1 = 'SELECT RANK() OVER( ORDER BY a.score DESC) AS rank, a.* FROM (SELECT username, IFNULL(contribution, 0), IFNULL(upvotes, 0), IFNULL(ROUND(upvotes*0.5 + contribution*0.5,0), 0) AS score FROM users LEFT JOIN (SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages) AS records GROUP BY fk_user_id) AS total ON user_id = fk_user_id ORDER BY score DESC) AS a'

  db.all(sql1, function(error,results){
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
        results: [],
        totalpage: totalpage,
        currentpage: currentpage,
        itemlimit: itemlimit
      });
      return;
    }
    
    let data = results.map(result => {
      return Object.values(result)
    })
    
    totalpage = data.length / itemlimit;

    if(data.length % itemlimit != 0 ){

      totalpage = Math.floor(totalpage)+1;

    }
  
    let data_pos_start = (currentpage - 1) * itemlimit;
    let data_pos_end = currentpage * itemlimit;
    let data_slice = data.slice(data_pos_start,data_pos_end);

    res.render("ranking", {
      user: req.user,
      title: "User Rankings",
      message: false,
      results: data_slice,
      totalpage: totalpage,
      currentpage: currentpage,
      itemlimit: itemlimit
    });
  });
});

router.get("/progress", function(req, res){
  res.render("progress",{
    user: req.user
  });
});


module.exports = router;