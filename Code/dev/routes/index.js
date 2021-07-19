const express = require('express');

const router = express.Router();

router.get("/",function(req, res){
  res.render("index", {
    title: "Site Title",
  });
});

router.get("/javascript",function(req, res){
  res.render("javascript", {
    title: "Javascript Snippets",
  });
});


router.get("*", function(req, res){
  res.render("progress");
});

module.exports = router;