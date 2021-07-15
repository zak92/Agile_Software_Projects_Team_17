const express = require('express');

const router = express.Router();

router.get("/",function(req, res)
{
  res.render("index", {
    title: "Dynamic Title",
    heading: "Dynamic Heading"
  });
});

module.exports = router;