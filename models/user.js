const mongoose = require("mongoose")

// User Schema
const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		userName: {
			type: String,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		isActive:{
			type: Boolean,
			required: true,
			default: true
		},
		emailSubbed:{
			type: Boolean,
		},
		profileImg: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image",
		},
		uploadedImgs: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image",
		}],
		auth:{
			type:String,
			required: true,
			enum:["User", "Mod", "Admin"]
		},
		//AUTH: User, Mod (Moderator), or Admin ONLY
		favoriteRestaurants: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Restaurant",
		}],
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("User", UserSchema)
