const mongoose = require("mongoose");

//trackschema using DBRefs to reference to audio data
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

const bookSchema = new mongoose.Schema({
    title: String,
    tracks: [trackSchema]
});

module.exports = mongoose.model("Book", bookSchema);