const express = require('express'),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("home");
});

//ABOUT - 
router.get("/about", function(req, res){
    res.render("about");
});


//=================
//auth routes

//register form (NEW USER)
router.get("/invite25052020", function(req, res){
    res.render("user/register");
});

//handling registration (USER CREATE)
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welkom bij de Voorlees Club, " + user.username);
            res.redirect("/");
        });
    });
});

//handling login
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: true
}), function(req, res){
    req.flash("success", "Welcome back " + req.body.username);
    res.redirect("/");
});

//logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Je bent uitgelogd");
    res.redirect("/");
});

module.exports = router;
