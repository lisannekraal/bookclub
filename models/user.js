const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

//trackSchema (just like books but then not the source of audio itself)
const usersTracksSchema = new mongoose.Schema({
    linkedTrack: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Track"
        }
    },
    played: {
        type: Boolean,
        default: false
    },
    time: Number
});

//let the user have one of the above objects per book in an array with books
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    books: [{
        title: String,
        tracks: [usersTracksSchema]
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);