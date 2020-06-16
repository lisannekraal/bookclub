const express = require('express'),
      router = express.Router(),
      Book = require("../models/book"),
      middleware = require("../middleware");


//INDEX - boekenkast
router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("boekenkast/boekenkast");
});

//SHOW - boekenkast
router.get("/heksen", middleware.isLoggedIn, function(req, res){
    const user = req.user;
    Book.find({"title": "Heksen: Eerherstel voor de vrouwelijke rebel"}, function(err, thisBook){
        if(err){
            console.log(err);
        } else {
            res.render("boekenkast/heksen", {bookObject: thisBook, currentUser: user});
        }
    });
});

module.exports = router;

