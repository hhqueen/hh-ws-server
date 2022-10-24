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
    // isPrice: {
    //     type: Boolean
    // },
    specialTypeId:{
        type: Number
        // 1 = price, 2 = percentDiscount, 3 = dollarsOff
    },
    value: {
        type: Number
    },
    // isPercentDiscount: {
    //     type: Boolean
    // },
    // percentDiscount: {
    //     type: Number
    // },
    // isDollarsOff: {
    //     type: Boolean
    // },
    // dollarsOff: {
    //     type: Number
    // }
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
    foodSpecialsDescription:{
        type: String
    },
    foodMenu: [MenuItemSchema],
    hasDrinkSpecials: {
        type: Boolean
    },
    drinkSpecialsDescription:{
        type: String
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