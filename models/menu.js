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
        // drinks or food
    },
    specialTypeId:{
        type: Number
        // 1 = price, 2 = percentDiscount, 3 = dollarsOff
    },
    value: {
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
    foodSpecialsDescription:{
        type: String
    },
    foodMenu: [MenuItemSchema],
    foodMenuImg:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image" 
    },
    hasDrinkSpecials: {
        type: Boolean
    },
    drinkSpecialsDescription:{
        type: String
    },
    drinkMenu: [MenuItemSchema],
    drinkMenuImg:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image" 
    },
    isFoodAndDrinkMenu:{
        type: Boolean
    },
    foodAndDrinkMenuImg:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image" 
    },
    restaurant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant" 
    }]
},{
    timestamps: true  
})


module.exports = mongoose.model('Menu', HHMenuSchema)