const mongoose = require("mongoose")

// User Schema
const VisitorActivitySchema = new mongoose.Schema(
	{
		userId: {
            type: mongoose.Schema.Types.ObjectId,
			ref: "User",
            default: null
		},
        elementId:{
			type: String,
		},
        elementType: {
            type: String,
        },
		emailSubbed:{
			type: Boolean,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("VisitorActivity", VisitorActivitySchema)
