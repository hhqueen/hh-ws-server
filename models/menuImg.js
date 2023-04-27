const mongoose = require('mongoose')

const MenuImgSchema = new mongoose.Schema({
    orderId:{
        type: Number
    },
    imageurl: {
        type: String
    },
    menuSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuSet"
    },
    SizeOptions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SizeOptions"
    },
},{
    timestamps: true  
})


module.exports = mongoose.model('MenuImg', MenuImgSchema)