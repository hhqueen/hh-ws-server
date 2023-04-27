const mongoose = require('mongoose')

const MenuSetSchema = new mongoose.Schema({
    maxWidth: {
        type: Number,
        default: 0
    },
    maxHeight: {
        type: Number,
        default: 0
    },
    resizeToScreenWidth:{
        type: Boolean,
        default: true
    },
    resizeToScreenHeight:{
        type: Boolean,
        default: true
    },
    menuImg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuImg",
        default: null
    },
    menuSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuSet",
        default: null
    }
},{
    timestamps: true  
})


module.exports = mongoose.model('SizeOptions', MenuSetSchema)