const express = require('express'),
      router = express.Router(),
      Wish = require("../models/wish"),
      middleware = require("../middleware");

//WISHLIST ROUTES (NEW FORM IS AT BOEKENKAST)


//INDEX - wishlist
router.get("/", middleware.isLoggedIn, function(req, res){
    //get all wished books from wishlist
    Wish.find({}, function(err, allWished){
        if(err){
            console.log(err);
        } else {
            res.render("wishlist/wishlist", {wishlist: allWished});
        }
    });
});

//CREATE - wishlist
router.post("/", middleware.isLoggedIn, function(req, res){
    //retrieve information from form and save as object
    const newBook = req.body.book;
    const user = {
        id: req.user._id,
        username: req.user.username
    };
    const newWish = {description: newBook, madeby: user};


    //create new db Wish and save to db
    Wish.create(newWish, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Je hebt een nieuw boek toegevoegd aan de wishlist!");
            res.redirect("/wishlist");
        }
    });
});

//DESTROY - wishlist
router.delete("/:wishlist_id", middleware.checkWishOwnership, function(req, res){
    Wish.findByIdAndRemove(req.params.wishlist_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Boek van wishlist verwijderd");
            res.redirect("/wishlist");
        }
    });
});




module.exports = router;




