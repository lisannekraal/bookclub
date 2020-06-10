//////////////////////////////////
//SET UP
/////////////////////////////////

const express = require('express'),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require('mongoose'),
      methodOverride = require("method-override"),
      flash = require("connect-flash");

    //requiring for database and user authentication
const Wish = require("./models/wish"), 
      User = require("./models/user"), 
      passport = require("passport"), 
      LocalStrategy = require("passport-local"),
      Grid = require("gridfs-stream");

    //requiring routes
const indexRoutes = require("./routes/index"),
      wishlistRoutes = require("./routes/wishlist"),
      boekenkastRoutes = require("./routes/boekenkast");

    //set bodyParser:
app.use(bodyParser.urlencoded({extended: true}));

    //create and set database:
//is we are in production, run the databaseurl set as an environment variable, otherwise, use localhost url
//const url = "mongodb+srv://Lisan:Kraal@cluster0-vyl2z.mongodb.net/heksen?retryWrites=true&w=majority"
const url = "mongodb://localhost/heksen";
//change url into process.env.DATABASEURL when we have Heroku running
//const url = process.env.DATABASEURL || "mongodb://localhost/heksen";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

    //make sure we can use the public folder for linked stylesheet and js:
app.use(express.static("public"));

    //make sure we can use ejs files:
app.set("view engine", "ejs");

    //use connect-flash so we can show messages
app.use(flash());

    //method-override so we can use DELETE and PUT
app.use(methodOverride("_method"));

    //require session, run it as a function with the secret to compute the has
app.use(require("express-session")({
    secret: "h8cv@8h!",
    resave: false,
    saveUninitialized: false
}));

    //setup user authentication through password
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){

    //we add currentUser to every single template
    res.locals.currentUser = req.user;

    //if there is anything in the flash, we access it through these:
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});

    //set gridfs and stream
const connection = mongoose.connection;
var gfs;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
    console.log("Connected!");
    gfs = new Grid(connection.db, mongoose.mongo);
  });


/////////////////////////////////
//ROUTES
/////////////////////////////////

app.use(indexRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/boekenkast", boekenkastRoutes);


    //RESTFUL ROUTES

    //name      url                 verb     description
    //============================================================================
    //-------FOR WISHLIST.JS
    //INDEX     /wishlist           GET      Show all wished for
    //NEW       (/boekenkast)       GET      Is actually on the index of boekenkast
    //CREATE    /wishlist           POST     Add new wish to wishlist

    //-------FOR BOEKENKAST.JS
    //INDEX     /boekenkast         GET      Show all books
    //SHOW      /boekenkast/:id     GET      Show specific book

    //-------FOR USERS/INDEX.JS
    //ROOT      /                   GET      Home page
    //          /about              GET      ABOUT
    //NEW       /invite25052020     GET      A register form to create new user
    //CREATE    /register           POST     Add a new user to database
    //          /login              POST
    //          /logout             GET      So funny that a login is a post request and a logout a get


//ROUTE FOR RETRIEVING AUDIO FROM DATABASE
app.get("/audio/:i", function (req, res) {
    console.log(req.params); //gives { i: '5' }
    const filename = req.params.i + ".mp3";
    console.log(filename); //gives public/audio/5.mp3

    //opens the gfs as a readable stream
    const readstream = gfs.createReadStream({filename: filename})
    //console.log(readstream);
    readstream.on('error', function (error) {
        console.log(error);
        res.sendStatus(500);
    })

    // This will wait until we know the readable stream is actually valid before piping
    readstream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
        readstream.pipe(res);
    });

    //res.type('*');
    //readstream.pipe(res);
 });

//OTHER ROUTES
app.get("*", function(req, res){
    res.send("This page does not exits within De Voorlees Club");
});

//PORT
// app.listen(4000, function() { 
//     console.log('Server listening on port 4000'); 
// });

app.listen(process.env.PORT || 4000, function() {
    console.log("Server started");
    });
