const mongoose = require('mongoose')

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description:{
        type: String
    },
    type: {
        type: String
    },
    isPrice: {
        type: Boolean
    },
    price: {
        type: Number
    },
    isPercentDiscount: {
        type: Boolean
    },
    percentDiscount: {
        type: Number
    },
    isDollarsOff: {
        type: Boolean
    },
    dollarsOff: {
        type: Number
    }
}, {
    timestamps: true
})

const HHMenuSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        default: null
    },
    isChain: {
        type: Boolean,
        default: false
    },    
    hasFoodSpecials: {
        type: Boolean
    },
    foodMenu: [MenuItemSchema],
    hasDrinkSpecials: {
        type: Boolean
    },
    drinkMenu: [MenuItemSchema],
    restaurant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant" 
    }]
},{
    timestamps: true  
})


module.exports = mongoose.model('Menu', HHMenuSchema)