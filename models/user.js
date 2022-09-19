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
			type: String,
			required: true,
		},
		FavoriteRestaurants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Restaurant",
			},
		],
		outfits: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Outfit",
			},
		],
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Tag",
			},
		]
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("User", UserSchema)
