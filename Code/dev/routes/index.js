const express = require('express');

const router = express.Router();
var db = require('../db');
var mainSearch = require('../modules/search');
var Ranking = require('../modules/ranking');
var view = require('../modules/view');
var reputation = require('../modules/reputation');

router.get("/",async function(req, res){

  try{
    //Ranking.mainranking([true/false],[Num of Limit])
    let RankingResults = await Ranking.mainranking(true,5);

    let formattedRankingResults = RankingResults.map(result => {
      return Object.values(result);
    })

    if(formattedRankingResults.length <= 0) {
      res.render("index",{
        user: req.user,
        title:"Site Title",
        message:"NO DATA",
        results:[]
      });
      return;
    }

    res.render("index", {
      user: req.user,
      title:"Site Title",
      message:false,
      results:formattedRankingResults
    });

  }catch(error){
    console.log(error);
    res.render("index", {
      user: req.user,
      title:"Site Title",
      message:"DB ERROR",
      results:[]
    });
  }

  // let sql1 = 'SELECT RANK() OVER( ORDER BY a.score DESC) AS rank, a.* FROM (SELECT username, IFNULL(contribution, 0), IFNULL(upvotes, 0), IFNULL(ROUND(upvotes*0.5 + contribution*0.5,0), 0) AS score FROM users LEFT JOIN (SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages) AS records GROUP BY fk_user_id) AS total ON user_id = fk_user_id ORDER BY score DESC) AS a LIMIT 5;';

  // db.all(sql1,function(error,results){
  //   if(error){
  //     res.render("index", {
  //       user: req.user,
  //       title:"Site Title",
  //       message:"DB ERROR",
  //       results:[]
  //     });
  //     return;
  //   }

  //   if(results.length <= 0) {
  //     res.render("index",{
  //       user: req.user,
  //       title:"Site Title",
  //       message:"NO DATA",
  //       results:[]
  //     });
  //     return;
  //   }
    
  //   let data = results.map(result => {
  //     return Object.values(result)
  //   })
    
  //   res.render("index", {
  //     user: req.user,
  //     title:"Site Title",
  //     message:false,
  //     results:data
  //   });
  // });
});

router.get(["/javascript", "/python", "/c%2B%2B"] ,function(req, res){
  view.viewLang(req,res)
});
router.get("/tools",function(req, res){
  view.viewTools(req,res)
});
router.get("/frameworks",function(req, res){
  view.viewFrameworks(req,res)
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
  Ranking.ranking(req,res);
});

router.get("/progress", function(req, res){
  res.render("progress",{
    user: req.user
  });
});

router.get("/viewcode",function(req, res){
  res.render("viewcode",{
    title: "View CodeSnippets",
    user: req.user
  });
    
});

router.get("/vote",function(req, res){
  reputation.upvote(req, res);
});

module.exports = router;