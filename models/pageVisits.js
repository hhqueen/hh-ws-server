const mongoose = require('mongoose')

const PageVisitsSchema = new mongoose.Schema({
    ipAddress:{
        type: String,
        default: null
    },
    OS:{
        type: String,
        default: null
    },
    Mobile:{
        type: Boolean
    },
    Browser:{
        type: String,
        default: null
    },
    uad:{
        type: String,
        default: null
    },
    screenWidth:{
        type: Number,
        default: null
    },
    ScreenHeight:{
        type: Number,
        default: null
    },
    endPointURL:{
        type: String,
        default: null
    },
    RestaurantId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("PageVisits", PageVisitsSchema)
