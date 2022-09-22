const mongoose = require('mongoose')

const TimeSchema = new mongoose.Schema({
    start1: {
        type: Number,
        min: -1,
        max: 24
    },
    end1: {
        type: Number,
        min: -1,
        max: 24
    },
    start2: {
        type: Number,
        min: -1,
        max: 24
    },
    end2: {
        type: Number,
        min: -1,
        max: 24
    },
}, {
    timestamps: true
})

const HoursSchema = new mongoose.Schema({
    day: {
        type: Number,
        min: 1,
        max: 7
    },
    hasHH: {
        type: Boolean
    },
    hhTimes: [TimeSchema],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant" 
    }
},{
    timestamps: true  
})


module.exports = mongoose.model('Hours', HoursSchema)