const express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var passport = require('passport');


const router = express.Router();
var db = require('../db');
var mainSearch = require('../modules/search');
var Ranking = require('../modules/ranking');
var view = require('../modules/view');
var reputation = require('../modules/reputation');
var codeAdded = require('../modules/codeadded');
var viewsnippet = require('../modules/viewsnippet');
var flagsnippet =  require('../modules/flag');
var users =  require('../modules/users');

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

//Start of user related routes
router.get("/myaccount",ensureLoggedIn(), function(req, res){
  users.viewAccount(req,res)
});

router.get('/login', function(req, res) {
  res.render('login', {user: req.user });
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/new', function(req, res) {
  res.render('signup',{user: req.user});
});

router.post('/users', function(req, res, next) {
  users.add(req, res,next)
});

//End of user related routes

router.get("/addcode",ensureLoggedIn(),function(req, res){
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
  viewsnippet.viewSnippets(req,res);
 
});

router.post("/flagsnippet/:type/:id",function(req, res){
  flagsnippet.flagSnippet(req, res);
  // set all amounts to zero
  /*let type = req.params.type;
  let str = type.slice(0,-1) + '_id';
  let str_id = type + `.` + str
  let query = `UPDATE ${type} SET flagged=1 WHERE ${str_id}=?` ;
         
  // execute sql query
  db.all(query,  [req.params.id],(err, result) => {
      if (err) {
          return console.log(err.message);
      }
      else {
        res.render("viewcode", {
          title: type,
          user: req.user,
          //dbsnippetresults: formattedSnippetResults
        
        });
      }
  });*/

});

router.post("/voted", function(req, res){

  reputation.Upvote_ajax(req, res);
})

router.get("/voted-check", function(req, res){

  reputation.CheckVote_ajax(req, res);
})

module.exports = router;