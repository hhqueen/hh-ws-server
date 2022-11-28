const cloudinary = require("cloudinary")
const axios = require("axios")

// cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_KEY,
	api_secret: process.env.CLOUD_SECRET,
})

uploadToCloudinary = async (path, folder) => {
	try {
		const response = await cloudinary.v2.uploader.upload(path, { folder })
		// console.log("cloudinary:",response)
		return { url: response.url, public_id: response.public_id }
	} catch (error) {
		console.warn(error)
	}
}

removeFromCloudinary = async (public_id) => {
	try {
		await cloudinary.v2.uploader.destroy(public_id, function (error, result) {
			console.log(result, error)
		})
	} catch (error) {
		console.warn(error)
	}
}

module.exports = { uploadToCloudinary, removeFromCloudinary }
