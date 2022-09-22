const router = require("express").Router()
const db = require("../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.get("/", async (req, res) => {
    try {
        // get all restaurants
        const allRests = await db.Restaurant.find({})
        res.status(200).json(allRests)
    } catch (error) {
        console.log(error)
    }
})

const yelpAPIsearch = require('../../services/yelpAPI')
router.get("/yelpSearch", async (req,res)=>{
    try {
        console.log(req.body)
        const results = await yelpAPIsearch(req.body)
        res.json(results)
    } catch (error) {
        console.warn(error)
    }
})

router.get("/:id", async (req, res) => {
    try {
        // return one restaurant by mongodb Id via req params
        const oneRest = await db.Restaurant.findById(req.params.id)
        res.status(200).json(oneRest)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router