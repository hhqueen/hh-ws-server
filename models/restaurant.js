const mongoose = require('mongoose')

const FilterSchema = new mongoose.Schema({
    name: {type: String},
    display: {type: String},
    value: {type: Boolean},
},{
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
    // hasDrinks: {
    //     type: Boolean
    // },
    // hasFood: {
    //     type: Boolean
    // },
    // dogFriendly: {
    //     type: Boolean
    // },
    // hasPatio: {
    //     type: Boolean
    // },
    // hasRoofTop: {
    //     type: Boolean
    // },
    filterParams:[FilterSchema],
    isActive:{
        type: Boolean,
        required: true,
        default: true
    },
    cuisines: [{
        type: String
    }],
    hourSet: {
		type: mongoose.Schema.Types.ObjectId,
        ref: "Hour"
	},
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