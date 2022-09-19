const mongoose = require('mongoose')

const RestaurantSchema = new mongoose.Schema({
    yelpRestaurantId: {
		type: String,
	},
    name: {
		type: String,
		required: true
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
    cuisines: [{
        type: String
    }],
	dishes:[{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
	}],
}, {
	timestamps: true
})

module.exports = mongoose.model('Restaurant', RestaurantSchema)