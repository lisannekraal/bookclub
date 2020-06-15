const express = require('express'),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user"),
      Book = require("../models/book"),
      mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
        title: String,
        filename: String, 
        trackRef: {
            id: {
            "$ref" : String,
            "$id" : {
                type: mongoose.Schema.Types.ObjectId
            },
            "$db" : String
        }}
    });
    
const Track = mongoose.model('Track', trackSchema);

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
    const id = req.user._id;
    const bookList = req.user.books;

    Book.find(
        //change this code when we are uploading a new book or new episodes to the application:
        {"title": "Heksen: Eerherstel voor de vrouwelijke rebel"}, 
        function(err, currentBook){
            if(err){
                console.log(err);
            } else {
                const newBookTitle = currentBook[0].title;
                const newBookTracks = currentBook[0].tracks;

                if(bookList.filter(book => book.title === newBookTitle).length){
                    console.log("This user has the book already listed in the array");
                    newBookTracks.forEach(dbtrack => {
                        User.findById(id, function(err, thisUser){
                            if(err){
                                console.log(err);
                            }else{
                                const userTracks = thisUser.books[0].tracks || [];
                                if(userTracks.length > 0){
                                    if(userTracks.filter(e => e.linkedTrack.equals(dbtrack._id)).length){
                                        console.log("you see, track already in users object");
                                    } else {
                                        newObject = {linkedTrack: dbtrack._id, played: false, time: 0}
                                        userTracks.push(newObject);
                                        console.log("new track added to existing array");
                                    }
                                } else {
                                    newObject = {linkedTrack: dbtrack._id, played: false, time: 0}
                                    userTracks.push(newObject);
                                    thisUser.books[0].tracks = userTracks;
                                    console.log("new track added")
                                }
                            }
                        })
                    });
                } else {
                    User.findById(id, function(err, thisUser){
                        if(err){
                            console.log(err);
                        }else{
                            thisUser.books.push({title: newBookTitle});
                            newBookTracks.forEach(dbtrack => {
                                thisUser.books.forEach(book => {
                                    newObject = {
                                        linkedTrack: `${dbtrack._id}`,
                                        played: false,
                                        time: 0
                                    }
                                    book.tracks.push(newObject);
                                })
                            });
                            thisUser.save();
                            console.log(thisUser);
                        }
                    });
                }
            }
    });
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