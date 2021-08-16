const express = require('express');

const router = express.Router();
var db = require('../db');
var mainSearch = require('../modules/search');
var Ranking = require('../modules/ranking');
var view = require('../modules/view');
var reputation = require('../modules/reputation');
var codeAdded = require('../modules/codeadded');
var viewsnippet = require('../modules/viewsnippet');

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

router.post("/codeadded", function(req, res){ 
  codeAdded.insertLang(req,res);
  codeAdded.insertTools(req,res);
  codeAdded.insertFrameworks(req,res);
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
  viewsnippet.viewSnippets(req,res)
  

});

router.get("/vote",function(req, res){
  reputation.upvote(req, res);
});

module.exports = router;