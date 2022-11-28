const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    fileName: {
        type: String
    },
    imgUrl: {
        type: String,
        required: true
    },
    publicId:{
        type: String,
        required: true
    },
    type:{
        type: Number
        // 0 = Profile, 1 = Food Menu, 2 = Drink Menu, 3 = Food AND Drink Menu
        // might be unnecessary
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu" 
    }
},{
    timestamps: true  
})

module.exports = mongoose.model('Image', ImageSchema)