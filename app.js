//////////////////////////////////
//SET UP
/////////////////////////////////

const express = require('express'),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require('mongoose'),
      methodOverride = require("method-override"),
      flash = require("connect-flash"),
      cacheManager = require('cache-manager');

var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10});
var ttl = 5;

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


//===============================================================================

// //TRY OUT CODE OF EXAMPLE

// class FileReadStreams {
//     constructor() {
//       this._streams = {};
//     }
  
//     make(file, options = null) {
//       return options ?
//         gfs.createReadStream({filename: file}, options)
//         : gfs.createReadStream({filename: file});
//     }
  
//     get(file) {
//       return this._streams[file] || this.set(file);
//     }
  
//     set(file) {
//       return this._streams[file] = this.make(file);
//     }
//   }
//   const readStreams = new FileReadStreams();
  
//   // Getting file stats and caching it to avoid disk i/o
//   function getFileStat(file, callback) {
//     let cacheKey = ['File', 'stat', file].join(':');
  
//     memoryCache.get(cacheKey, function(err, stat) {
//       if(stat) {
//         return callback(null, stat);
//       }
  
//       fs.stat(file, function(err, stat) {
//         if(err) {
//           return callback(err);
//         }
  
//         memoryCache.set(cacheKey, stat);
//         callback(null, stat);
//       });
//     });
//   }
  
//   // Streaming whole file
//   function streamFile(file, req, res) {
//     getFileStat(file, function(err, stat) {
//       if(err) {
//         console.error(err);
//         return res.status(404);
//       }
  
//       let bufferSize = 1024 * 1024;
//       res.writeHead(200, {
//         'Cache-Control': 'no-cache, no-store, must-revalidate',
//         'Pragma': 'no-cache',
//         'Expires': 0,
//         'Content-Type': 'audio/mpeg',
//         'Content-Length': stat.size
//       });
//       readStreams.make(file, {bufferSize}).pipe(res);
//     });
//   }
  
//   // Streaming chunk
//   function streamFileChunked(file, req, res) {
//     getFileStat(file, function(err, stat) {
//       if(err) {
//         console.error(err);
//         return res.status(404);
//       }
  
//       let chunkSize = 1024 * 1024;
//       if(stat.size > chunkSize * 2) {
//         chunkSize = Math.ceil(stat.size * 0.25);
//       }
//       let range = (req.headers.range) ? req.headers.range.replace(/bytes=/, "").split("-") : [];
  
//       range[0] = range[0] ? parseInt(range[0], 10) : 0;
//       range[1] = range[1] ? parseInt(range[1], 10) : range[0] + chunkSize;
//       if(range[1] > stat.size - 1) {
//         range[1] = stat.size - 1;
//       }
//       range = {start: range[0], end: range[1]};
  
//       let stream = readStreams.make(file, range);
//       res.writeHead(206, {
//         'Cache-Control': 'no-cache, no-store, must-revalidate',
//         'Pragma': 'no-cache',
//         'Expires': 0,
//         'Content-Type': 'audio/mpeg',
//         'Accept-Ranges': 'bytes',
//         'Content-Range': 'bytes ' + range.start + '-' + range.end + '/' + stat.size,
//         'Content-Length': range.end - range.start + 1,
//       });
//       stream.pipe(res);
//     });
// }

// app.get("/audio/:i", (req, res) => {
//     const file = req.params.i + '.mp3';
//     if(/firefox/i.test(req.headers['user-agent'])) {
//         return streamFile(file, req, res);
//     }
//     streamFileChunked(file, req, res);
// });


//================================================================================


// //ROUTE FOR RETRIEVING AUDIO FROM DATABASE
app.get("/audio/:i", function (req, res) {
    //console.log(req.params); //gives { i: '5' }
    const filename = req.params.i + ".mp3";
    var total = 240260;
    var range = [0, total, 0];

    //opens the gfs as a readable stream
    const readstream = gfs.createReadStream({filename: filename})
    readstream.on('error', function (error) {
        console.log(error);
        res.sendStatus(500);
    });

    var header = {
        'Content-Length': range[1],
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': req.headers.origin || "*",
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'POST, GET, OPTIONS',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
        'Accept-Ranges': 'bytes',
        'Content-Range': 'bytes ' + range[0] + '-' + range[1] + '/' + total,
        'Content-Length': range[2]
    };

    // This will wait until we know the readable stream is actually valid before piping
    readstream.on('open', function () {
        //res.setHeader('Accept-Ranges', 'bytes');
        
        res.writeHead(206, header);
        // res.writeHead(200, {
        //     'Cache-Control': 'no-cache, no-store, must-revalidate',
        //     'Pragma': 'no-cache',
        //     'Expires': 0,
        //     'Content-Type': 'audio/mpeg'
        // });

        // This just pipes the read stream to the response object (which goes to the client)
        readstream.pipe(res);
    });
});


//================================hieronder is oud

// //ROUTE FOR RETRIEVING AUDIO FROM DATABASE
// app.get("/audio/:i", function (req, res) {
//     //console.log(req.params); //gives { i: '5' }
//     const filename = req.params.i + ".mp3";
//     //console.log(filename); //gives 5.mp3

//     //opens the gfs as a readable stream
//     const readstream = gfs.createReadStream({filename: filename})
//     readstream.on('error', function (error) {
//         console.log(error);
//         res.sendStatus(500);
//     })

//     // This will wait until we know the readable stream is actually valid before piping
//     readstream.on('open', function () {
//     // This just pipes the read stream to the response object (which goes to the client)
//         readstream.pipe(res);
//     });

//     //res.type('*');
//     //readstream.pipe(res);
//  });

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
