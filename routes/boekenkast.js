const express = require('express'),
      router = express.Router(),
      middleware = require("../middleware");



//INDEX - boekenkast
router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("boekenkast/boekenkast");
});

//SHOW - boekenkast
router.get("/heksen", middleware.isLoggedIn, function(req, res){
    res.render("boekenkast/heksen");
});



module.exports = router;

