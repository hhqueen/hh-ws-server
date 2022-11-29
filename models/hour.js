const mongoose = require('mongoose')

const HourSchema = new mongoose.Schema({
    day: {
        type: Number,
        min: 0,
        max: 6
    },
    hasHH1: {
        type: Boolean
    },
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
    end1close:{
        type: Boolean
    },
    hasHH2: {
        type: Boolean
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
    end2close:{
        type: Boolean
    }
}, {
    timestamps: true
})

const HourSetSchema = new mongoose.Schema({
    originalRestaurant:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
	},
    description:{
        type: String
    },
    hours:[HourSchema],
    restaurants:[{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
	}]
}, {
    timestamps: true
})

module.exports = mongoose.model("Hour", HourSetSchema)
