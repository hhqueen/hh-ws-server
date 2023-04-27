const mongoose = require('mongoose')

const MenuSetSchema = new mongoose.Schema({
    type: {
        type: String,
        Enumerator: ["food", "drinks", "food/drnks"]
    },
    restaurants: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    FoodMenuImgs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuImgs"
    },
    DrinkMenuImgs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuImgs"
    },
    DrinkFoodMenuImgs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuImgs"
    },
    SizeOptions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SizeOptions"
    },
},{
    timestamps: true  
})


module.exports = mongoose.model('MenuSet', MenuSetSchema)