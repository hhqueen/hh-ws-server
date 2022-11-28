const router = require("express").Router()
const { model } = require("mongoose")
const {uploadToCloudinary, removeFromCloudinary} = require("../../services/cloudinary")
const db = require("../../models")
const multer = require("multer")
const { unlinkSync } = require('fs')

// setting up the multer engine
const uploads = multer({dest: "/tmp/uploads"})

router.post("/upload", uploads.single('image'), async (req,res) => {
    try {        
        console.log(req.file)
        console.log(req.body)
        const data = await uploadToCloudinary(req.file.path, req.body.cloud_folder_name)
        console.log(data)
        const image = await db.Image.create({
            fileName: req.file.originalname,
            imgUrl: data.url,
            publicId: data.public_id,
            type: req.body.imgType
        })
        unlinkSync(req.file.path)
        res.status(200).json(image)
    } catch (error) {
        console.warn(error)
        res.status(400).send(error)
    }
})

module.exports = router