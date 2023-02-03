const router = require("express").Router()
const db = require("../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {decToDist} = require('../../functions/geoDistance.js')
const {forwardSearchByTerm} = require('../../services/positionStack.js')
const geolib = require('geolib');

router.get("/", async (req, res) => {
    try {

        // console.log("middlewareREQ:",req.MiddlewareData)
        // console.log("restRoute_Req",req.method, req.originalUrl, req.body, req.query)
        console.log("restRoute_ReqQuery",req.query)
        const searchRadius = {
            distance: 5,
            UOM: "mi"
        }

        // defaults to coordinates 0,0
        let currentLongitudeInDecimal = 0
        let currentLatitudeInDecimal = 0
        
        // if the address is current location, use the current lat and long
        if(req.query.address === "Current Location") {
            currentLongitudeInDecimal = Number(req.query.currentLongitude)
            currentLatitudeInDecimal = Number(req.query.currentLatitude)
        }

        // if the address exists (implied not "Current Location"), use the position stack API (add WIP for existing locations in db)
        if(req.query.address !== "Current Location" && req.query.address.length > 0 ) {
            const posStackResponse = await forwardSearchByTerm(req.query.address)
            // console.log("posStackResponse:",posStackResponse)
            currentLongitudeInDecimal = posStackResponse[0]?.longitude
            currentLatitudeInDecimal = posStackResponse[0]?.latitude 
        }

        // console.log("current latLong_server:",currentLongitudeInDecimal,currentLatitudeInDecimal)

        // returns new coordinates in 4 directions +/- latitude and +/- longitude based on search Radius Parameters
        const newDeciCoords = decToDist(currentLatitudeInDecimal,currentLongitudeInDecimal, searchRadius.distance, searchRadius.UOM)
        // console.log("newDeciCoords:",newDeciCoords)


        // get all restaurants
        const allRests = await db.Restaurant.find({
            $and:[            
                {
                    longitude: {$gte: newDeciCoords.negLong},
                    longitude: {$lte: newDeciCoords.posLong},
                    latitude: {$gte: newDeciCoords.negLat},
                    latitude: {$lte: newDeciCoords.posLat}
                },
                {isActive:true}
            ],
            // checks name and cuisines for wildcard match against search term
            $or: [
                {name: {$regex: req.query.searchTerm, $options:"i"}},
                {cuisines: {$regex: req.query.searchTerm, $options:"i"}}
            ],

        }).populate([{ path: "hourSet" }, { path: "filterParams" }])

        const presortedArray = []
        geoLib_getDistanceAccuracyOption = 1
        allRests.forEach((item)=>{
            const distance = geolib.getDistance({
                latitude: currentLatitudeInDecimal, longitude:currentLongitudeInDecimal
            }, {
                latitude: item.latitude, longitude: item.longitude
            }, geoLib_getDistanceAccuracyOption)
            
            presortedArray.push({
                _id: item._id,
                distance
            })
        })
        // console.log("presortedArray:",presortedArray)
        // console.log("allRests Length",allRests)
        const sortedArray = presortedArray.sort((a,b)=> {
           if (a.distance < b.distance) return -1
           if (a.distance < b.distance) return 1
           return 0
        })
        // console.log("sortedArray",sortedArray)

        const sortedAllRests = []
        sortedArray.forEach((rest)=>{
            const foundRest = allRests.find((entry) => entry._id == rest._id)
            sortedAllRests.push(foundRest)
        })
        // console.log("sortedAllRests:",sortedAllRests)

        res.status(200).json(sortedAllRests)
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
        console.log("req.body._id:",req.body._id)
        const isNew = req.body.restaurantData._id === undefined
        console.log("isNew Bool:",isNew)
        if (isNew === true) {
            // check if the restaurant exits in db
            const findRestByYelpId = await db.Restaurant.findOne({
                yelpRestaurantId: req.body.restaurantData.yelpRestaurantId
            })
            if (findRestByYelpId) {
                return res.status(200).json({ msg: `${req.body.restaurantData.name} already exists!`, id: findRestByYelpId._id })
            }
        }

        const createdRest = await createEditRest(req.body.restaurantData, req.createdApiCall)
        // console.log("createdRest:",createdRest)
        // console.log(createdRest)
        console.log("req.body.restaurantData",req.body.restaurantData)
        await addEditHours(createdRest, req.body.restaurantData.hourSet, req.createdApiCall)
        await addEditCusine(createdRest, req.body.restaurantData.cuisines, req.createdApiCall)
        const createdMainMenu = await addEditMainMenu(createdRest, req.body.restaurantData.menu, req.createdApiCall)
        await addEditFoodMenu(createdMainMenu, req.body.restaurantData.menu.foodMenu, req.createdApiCall)
        await addEditDrinkMenu(createdMainMenu, req.body.restaurantData.menu.drinkMenu, req.createdApiCall)
        res.status(201).json({ msg: `${createdRest.name} was successfully created`, id: createdRest._id })
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

router.post("/refreshYelpCuisines/:id", async (req,res)=>{
    try {
        const foundRest = await db.Restaurant.findById(req.params.id)
        const yelpData = await yelpAPI.returnYelpBusById(foundRest.yelpRestaurantId)
        
        // console.log(yelpData)
        foundRest.cuisines = []
        yelpData.categories.forEach((cat)=>{
            foundRest.cuisines.push(cat.title)
        })
        await foundRest.save()
        console.log(foundRest)
        res.status(200).json(foundRest)

    } catch (error) {
        console.log(error)
    }

})

module.exports = router