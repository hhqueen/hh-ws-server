const mongoose = require('mongoose')

const HoursSchema = new mongoose.Schema({
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
    },
}, {
    timestamps: true
})

const RestaurantSchema = new mongoose.Schema({
    yelpRestaurantId: {
		type: String,
        required: true
	},
    name: {
		type: String,
		required: true
	},
    telNumber: {
        type: String
    },
    displayNumber: {
        type: String
    },
	address1: {
		type: String
	},
	address2: {
		type: String
	},
	address3: {
		type: String
	},
	city: {
		type: String
	},
    zip_code: {
		type: String
	},
    country: {
		type: String
	},
    state: {
		type: String
	},
    latitude: {
		type: Number
	},
    longitude: {
		type: Number
	},
	image_url: {
		type: String
	},
    hasDrinks: {
        type: Boolean
    },
    hasFood: {
        type: Boolean
    },
    dogFriendly: {
        type: Boolean
    },
    hasPatio: {
        type: Boolean
    },
    hasRoofTop: {
        type: Boolean
    },
    isActive:{
        type: Boolean,
        required: true,
        default: true
    },
    cuisines: [{
        type: String
    }],
    hours: [HoursSchema],
	regulars:[{
		type: mongoose.Schema.Types.ObjectId,
        ref: "User"
	}],
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu" 
    }
}, {
	timestamps: true
})

module.exports = mongoose.model('Restaurant', RestaurantSchema)