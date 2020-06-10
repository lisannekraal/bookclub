const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    description: String,
    madeby: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Wish", wishlistSchema);