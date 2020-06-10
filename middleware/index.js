//file for middleware
const Wish = require("../models/wish");
const middlewareObj = {};

//middleware holds a function that checks if the user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Log in om deze pagina te zien")
    res.redirect("back");
};

//middleware holds a function that checks whether the wish on the wishlist is entered by that user
middlewareObj.checkWishOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        //find the Wish that is requested?
        Wish.findById(req.params.wishlist_id, function(err, foundWish){
            if(err){
                req.flash("error", "Something went wrong");
                res.redirect("back");
            } else {
                if(foundWish.madeby.id.equals(req.user._id)){
                    //then we move on to the code in the route handler where this object is used
                    next();
                } else {
                    //means that Wish is not made by this user
                    req.flash("error", "Je bent geen eigenaar van deze wish");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Log eerst in");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
