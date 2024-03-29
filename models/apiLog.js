const mongoose = require('mongoose')

const APILogSchema = new mongoose.Schema({
    modifiedBy:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
	},
    ipAddress: {
        type: String,
        default: null
    },
    UI_ElementName: {
        type: String,
        default: null
    },
    UI_ElementId: {
        type: String,
        default: null
    },
    UI_ElementValue: {
        type: String,
        default: null
        
    },
    UI_ElementChecked: {
        type: String,
        default: null
    },
    UI_ComponentName: {
        type: String,
        default: null
    },
    httpMethod: {
        type: String,
        default: null
    }, // get, post, put, delete, etc.
    endPointURL:{
        type: String,
        default: null
    },
    reqParams:{
        type: Object,
        default: null
    },
    reqQuery:{
        type: Object,
        default: null
    },
    reqBody: {
        type: Object,
        default: null
    },
    error:{
        type: Object,
        default: null
    },
    executed_date: {
        type: Date,
        default: new Date
    },
    activities:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ActivityLog",
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("APILog", APILogSchema)
