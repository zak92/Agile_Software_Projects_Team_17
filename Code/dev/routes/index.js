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


router.get("/search",function(req, res){

  let searchTerm = req.query.search 
  // Search db for code snippets based on search query
  db.query('SELECT * from languages WHERE title like ?', '%' + searchTerm + '%', function (error, results, fields) {
    if (error) {
        res.render("progress");
    }

    if (results.length <= 0) {
        res.render("search", {
          title: "Search",
          message: 'No results found',
          results: []
        });
        return;
    }

    let data = results.map(result => {
        return Object.values(result)
    })

    res.render("search", {
      title: "Search",
      message: false,
      results: data
    });
  });
});






// --------------------------------------------------------------------------------------------------
// Note this should be the last endpoint in this file. Otherwise it will override everything after it.
router.get("*", function(req, res){
  res.render("progress");
});

module.exports = router;