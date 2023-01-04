const router = require("express").Router()
const db = require("../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {decToDist} = require('../../functions/geoDistance.js')
const {forwardSearchByTerm} = require('../../services/positionStack.js')

router.get("/", async (req, res) => {
    try {
        console.log("restRoute_ReqQuery",req.query)
        const searchRadius = {
            distance: 5,
            UOM: "mi"
        }

        let currentLongitudeInDecimal = Number(req.query.currentLongitude === 'null' ? null ?? 0 : req.query.currentLongitude)
        let currentLatitudeInDecimal = Number(req.query.currentLatitude === 'null' ? null ?? 0 : req.query.currentLatitude)

        console.log("current latLong_server:",currentLongitudeInDecimal,currentLatitudeInDecimal)
        if(req.query.address !== "Current Location" && req.query.address.length > 0 ) {
            const posStackResponse = await forwardSearchByTerm(req.query.address)
            console.log("posStackResponse:",posStackResponse)
            currentLongitudeInDecimal = posStackResponse[0]?.longitude
            currentLatitudeInDecimal = posStackResponse[0]?.latitude 
        }

        const newDeciCoords = decToDist(currentLatitudeInDecimal,currentLongitudeInDecimal, searchRadius.distance, searchRadius.UOM)
        console.log("newDeciCoords:",newDeciCoords)

        // get all restaurants
        const allRests = await db.Restaurant.find({
            // currently in feet, needs to be in decimal format
            $and:[            
                {
                    longitude: {$gte: newDeciCoords.negLong},
                    longitude: {$lte: newDeciCoords.posLong},
                    latitude: {$gte: newDeciCoords.negLat},
                    latitude: {$lte: newDeciCoords.posLat}
                },
                {isActive:true}
            ],
            $or: [
                {name: {$regex: req.query.searchTerm, $options:"i"}},
                {cuisines: {$regex: req.query.searchTerm, $options:"i"}}
            ]
        })
        // const allRests = await db.Restaurant.find({
        //     isActive:true})
        .populate([{ path: "hourSet" }, { path: "filterParams" }])
        console.log("allRests Length",allRests)
        res.status(200).json(allRests)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

const yelpAPI = require('../../services/yelpAPI')
router.get("/yelpSearch", async (req, res) => {
    try {
        const reqbody = {
            searchTerm: req.query.search,
            coordinates: {
                lat: req.query.lat,
                long: req.query.long
            },
            location: req.query.address
        }
        const results = await yelpAPI.yelpAPIsearch(reqbody)
        console.log(results)
        res.status(200).json({ results })
    } catch (error) {
        console.warn(error)
        res.status(400).json({ error })
    }
})

router.get("/:id", async (req, res) => {
    try {
        // return one restaurant by mongodb Id via req params
        const oneRest = await db.Restaurant.findById(req.params.id)
            .populate(
                [{
                    path: "menu",
                    populate: [
                        { path: "drinkMenuImg" }, { path: "foodMenuImg" }, { path: "foodAndDrinkMenuImg" }
                    ]
                }, { path: "hourSet" }, { path: "filterParams" }
                ])
        console.log("oneRestById:", oneRest)
        res.status(200).json(oneRest)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

const {
    createEditRest,
    addEditHours,
    addEditMainMenu,
    addEditFoodMenu,
    addEditDrinkMenu,
    addEditCusine
} = require('../../functions/createNewRest.js')

router.post("/newRestaurant", async (req, res) => {
    console.log("rest_reqBody:",req.body)
    try {
        // checks if new or edit restaurant
        const isNew = req.body._id === undefined
        console.log("isNew Bool:",isNew)
        if (!isNew) {
            // check if the restaurant exits in db
            const findRestByYelpId = await db.Restaurant.findOne({
                yelpRestaurantId: req.body.restaurantData.yelpRestaurantId
            })
            if (findRestByYelpId) {
                res.status(200).json({ msg: `${req.body.restaurantData.name} already exists!`, id: findRestByYelpId._id })
                return
            }
        }

        const createdRest = await createEditRest(req.body.restaurantData)
        // console.log("createdRest:",createdRest)
        // console.log(createdRest)
        // console.log("req.body.restaurantData",req.body.restaurantData)
        await addEditHours(createdRest, req.body.restaurantData.hourSet)
        await addEditCusine(createdRest, req.body.restaurantData.cuisines)
        const createdMainMenu = await addEditMainMenu(createdRest, req.body.restaurantData.menu)
        await addEditFoodMenu(createdMainMenu, req.body.restaurantData.menu.foodMenu)
        await addEditDrinkMenu(createdMainMenu, req.body.restaurantData.menu.drinkMenu)
        res.status(201).json({ msg: `${createdRest.name} was successfully created`, id: createdRest._id })
        return
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: `There was an error!`, error })
    }
})

router.delete("/:id", async (req,res) =>{
    try {
        console.log(req.params.id)
        const deleted = await db.Restaurant.findByIdAndUpdate(req.params.id,{isActive:false})
        res.status(200).json({msg:`${deleted.name} id:${req.params.id} deleted Successfully!`})
    } catch (error) {
        console.log(error)
    }
})

module.exports = router