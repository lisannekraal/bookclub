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
      Book = require("./models/book"), 
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
const url = "mongodb+srv://Lisan:Kraal@cluster0-vyl2z.mongodb.net/heksen?retryWrites=true&w=majority";
//const url = process.env.DATABASEURL || "mongodb://localhost/heksen";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});



// var heksen = new Book({
//     title: "Heksen: Eerherstel voor de vrouwelijke rebel",
//     tracks: [{
//         title: "Inleiding: de erfgenamen",
//         filename: "1.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d034804cd838163bda61",
//             "$db" : "heksen"
//         }}},
//         { title: "Vrouwenhoofden die boven het maaiveld worden afgehakt",
//         filename: "2.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d03b7ad9cda6c42dea86",
//             "$db" : "heksen"
//         }}},
//         { title: "Een ontkende of onwerkelijke geschiedenis",
//         filename: "3.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d040a5ee98594fdfcf8a",
//             "$db" : "heksen"
//         }}},
//         { title: "Van de tovernaar van Oz naar StarHawk",
//         filename: "4.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d045abd391b319117f79",
//             "$db" : "heksen"
//         }}},
//         { title: "De bezoekster in de schemering",
//         filename: "5.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d04ad77e4311f3b49444",
//             "$db" : "heksen"
//         }}},
//         { title: "Moeten we het hart van de zeeman van hydra verslinden?",
//         filename: "6.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d04ffcf8f9f3ebba8f95",
//             "$db" : "heksen"
//         }}},
//         { title: "Hoofstuk 1: Een eigen leven; De plaag van de vrouwelijke onafhankelijkheid",
//         filename: "7.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d0530a3485f8621b79c6",
//             "$db" : "heksen"
//         }}},
//         { title: "De avonturierster, een verboden voorbeeld",
//         filename: "8.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d05823d4921429026235",
//             "$db" : "heksen"
//         }}},
//         { title: "Weg met de rebellen!",
//         filename: "9.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d05df4429ace404a3370",
//             "$db" : "heksen"
//         }}},
//         { title: "Wie is de duivel?",
//         filename: "10.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d068b18133c7c2c5a343",
//             "$db" : "heksen"
//         }}},
//         { title: "De reflex van dienstbaarheid",
//         filename: "11.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d06ea6446a5241be52c1",
//             "$db" : "heksen"
//         }}},
//         { title: "Het 'instituut moederschap', een blok aan het been",
//         filename: "12.mp3",
//         trackRef: {
//             id: {
//             "$ref" : "fs.files",
//             "$id" : "5ee0d073fe6ff2b48d41e978",
//             "$db" : "heksen"
//         }}},
//         ]
// });

// heksen.save(function(err, book){
//     if(err){
//         console.log("error during saving");
//     } else {
//         console.log("successfully saved heksen");
//         console.log(book);
//     }
// });


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
