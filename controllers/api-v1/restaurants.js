const router = require("express").Router()
const db = require("../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.get("/", async (req, res) => {
    try {
        // get all restaurants
        const allRests = await db.Restaurant.find({})
        .populate("menu")
        console.log(allRests)
        res.status(200).json(allRests)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

const yelpAPI = require('../../services/yelpAPI')
router.get("/yelpSearch", async (req,res)=>{
    // ?search=:term&lat=:lat&long=:long&address=:address
    try {
        // console.log(req.body)
        console.log(req.query)
        const reqbody = {
            searchTerm: req.query.search,
            coordinates:{
                lat:req.query.lat,
                long:req.query.long
            },
            location:req.query.address
        }
        const results = await yelpAPI.yelpAPIsearch(reqbody)
        res.status(200).json(results)
    } catch (error) {
        console.warn(error)
        res.status(400).json(error)
    }
})

router.get("/:id", async (req, res) => {
    try {
        // return one restaurant by mongodb Id via req params
        const oneRest = await db.Restaurant.findById(req.params.id)
        .populate("menu")
        res.status(200).json(oneRest)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

const {
    createNewRest,
    addHours,
    addMainMenu,
    addFoodMenu,
    addDrinkMenu,
    addCusine
} = require('../../functions/createNewRest.js')

router.post("/newRestaurant", async (req,res) => {
    try {       
        const createdRest = await createNewRest(req.body.restaurantData)
        // console.log(createdRest)
        await addHours(createdRest, req.body.restaurantData.hours)
        const createdMainMenu = await addMainMenu(createdRest, req.body.restaurantData.menu)
        await addFoodMenu(createdMainMenu,req.body.restaurantData.menu.foodMenu)
        await addDrinkMenu(createdMainMenu,req.body.restaurantData.menu.drinkMenu)
        // const newRest = await db.Restaurant.create({
        //     yelpRestaurantId, name,
        //     telNumber,
        //     cuisines,
        //     displayNumber,
        //     address1,
        //     address2,
        //     address3,
        //     city,
        //     zip_code,
        //     country,
        //     longitude,
        //     latitude,
        //     image_url
        // })
        // console.log(newRest)
        res.status(200).json({msg:"yep"})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

module.exports = router