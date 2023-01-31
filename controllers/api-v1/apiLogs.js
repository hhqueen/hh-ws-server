const router = require("express").Router()
const db = require("../../models")

router.post("/", async (req,res)=>{
    try {
        console.log("apiLog EndPoint Hit")
        res.status(200).send()
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router