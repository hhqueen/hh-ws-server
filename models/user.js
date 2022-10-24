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
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		profileImg: {
			type: String
		},
		auth:{
			type:String,
			required: true
		},
		//AUTH: User or Admin ONLY
		favoriteRestaurants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Restaurant",
			},
		],
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("User", UserSchema)
