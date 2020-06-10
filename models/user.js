const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

//building user's information for what books listened to and where he/she left off

//store each audio element witch the associated track's currentTime
const trackSchema = new mongoose.Schema({
    track: Number,
    time: Number
});

//list these track schema's under an object with title
const bookSchema = new mongoose.Schema({
    title: String,
    startedTracks: [trackSchema]
});

//let the user have one of the above objects per book in an array with books
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    books: [bookSchema]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);