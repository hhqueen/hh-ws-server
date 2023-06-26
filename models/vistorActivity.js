const mongoose = require("mongoose")

// User Schema
const VisitorActivitySchema = new mongoose.Schema(
	{
		userId: {
            type: mongoose.Schema.Types.ObjectId,
			ref: "User",
            default: null
		},
		restarauntId:{
            type: mongoose.Schema.Types.ObjectId,
			ref: "Restaurant",
            default: null
		},
        elementId:{
			type: String,
			default: null
		},
		value:{
			type: String,
			default: null
		},
		message: {
			type: String,
			default: null
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("VisitorActivity", VisitorActivitySchema)
