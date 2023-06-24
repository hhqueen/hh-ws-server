const router = require("express").Router()
const db = require("../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { decToDist, boxCoordsFromlatLong, miToKm } = require('../../functions/geoDistance.js')
const { forwardSearchByTerm } = require('../../services/positionStack.js')
const geolib = require('geolib');
const { activityLogger, activityLogTemplate } = require('../../functions/activityLogger')


router.get("/", async (req, res) => {
    try {
        console.log("restRoute_ReqQuery", req.query)

        const searchRadius = {
            distance: Number(req.query.distance),
            UOM: req.query.UOM
        }

        let distanceMeters
        if (searchRadius.UOM = "mi") { distanceMeters = miToKm(searchRadius.distance) * 1000 }

        const coordinates = {
            latitude: Number(req.query.currentLatitude),
            longitude: Number(req.query.currentLongitude)
        }

        const { gmapBoxState, searchOnMapMove } = req.query
        console.log("searchOnMapMove", searchOnMapMove)
        let newDeciCoords = {}
        if (searchOnMapMove == 'false') {
            console.log("using center and radius")
            newDeciCoords = boxCoordsFromlatLong(coordinates, distanceMeters)
        } else if (searchOnMapMove == 'true') {
            console.log("using gmap bounds")
            const parsedGmapBoxState = JSON.parse(gmapBoxState)
            console.log("parsedGmapBoxState", parsedGmapBoxState)
            const { north, south, east, west } = parsedGmapBoxState
            newDeciCoords = {
                posLong: Number(east),
                posLat: Number(north),
                negLong: Number(west),
                negLat: Number(south)
            }
        }

        console.log("newDeciCoords", newDeciCoords)


        // get all restaurants
        const allRests = await db.Restaurant.find({
            $and: [
                { longitude: { $gt: newDeciCoords.negLong, $lt: newDeciCoords.posLong } },
                { latitude: { $gt: newDeciCoords.negLat, $lt: newDeciCoords.posLat } }
            ],
            $or: [
                { name: { $regex: req.query.searchTerm, $options: "i" } },
                { cuisines: { $regex: req.query.searchTerm, $options: "i" } }
            ],
            isActive: true
        }).populate([{ path: "hourSet" }, { path: "filterParams" }])


        console.log("allRests:", allRests)
        let presortedArray = []
        geoLib_getDistanceAccuracyOption = 1

        if (searchOnMapMove == 'false') {
            allRests.forEach((item) => {
                const distance = geolib.getDistance(coordinates, { latitude: item.latitude, longitude: item.longitude })
                if (distance <= distanceMeters) {
                    presortedArray.push({
                        _id: item._id,
                        distance
                    })
                }
            })
        } else if (searchOnMapMove == 'true'){
            presortedArray = allRests
        }

        // console.log("presortedArray:",presortedArray)
        // console.log("allRests Length",allRests)
        const sortedArray = presortedArray.sort((a, b) => {
            if (a.distance < b.distance) return -1
            if (a.distance > b.distance) return 1
            return 0
        })
        // console.log("sortedArray",sortedArray)

        const sortedAllRests = []
        sortedArray.forEach((rest) => {
            const foundRest = allRests.find((entry) => entry._id === rest._id)
            sortedAllRests.push(foundRest)
        })
        // console.log("sortedAllRests:",sortedAllRests)
        activityLogger({
            DB_query_result: sortedAllRests,
            apiCall: req.createdApiCall
        })
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

router.get("/dbYelpIdCheck/:yelpId", async (req, res) => {
    try {
        const yelpId = req.params.yelpId
        const foundRest = await db.Restaurant.findOne({
            yelpRestaurantId: yelpId
        })
        // console.log("foundRest:", foundRest)
        res.status(200).json(foundRest)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get("/page/:id", async (req, res) => {
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
        // console.log("oneRestById:", oneRest)
        activityLogger({
            DB_query_result: oneRest,
            apiCall: req.createdApiCall
        })
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
    console.log("rest_reqBody:", req.body)
    try {
        // checks if new or edit restaurant
        console.log("req.body._id:", req.body._id)
        const isNew = req.body.restaurantData._id === undefined
        console.log("isNew Bool:", isNew)
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
        console.log("req.body.restaurantData", req.body.restaurantData)
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

router.delete("/page/:id", async (req, res) => {
    try {
        console.log(req.params.id)
        const deleted = await db.Restaurant.findByIdAndUpdate(req.params.id, { isActive: false })
        res.status(200).json({ msg: `${deleted.name} id:${req.params.id} deleted Successfully!` })
    } catch (error) {
        console.log(error)
    }
})

router.post("/refreshYelpCuisines/:id", async (req, res) => {
    try {
        const foundRest = await db.Restaurant.findById(req.params.id)
        const yelpData = await yelpAPI.returnYelpBusById(foundRest.yelpRestaurantId)

        // console.log(yelpData)
        foundRest.cuisines = []
        yelpData.categories.forEach((cat) => {
            foundRest.cuisines.push(cat.title)
        })
        await foundRest.save()
        console.log(foundRest)
        res.status(200).json(foundRest)

    } catch (error) {
        console.log(error)
    }

})

router.get("/totalNumber", async (req, res) => {
    try {
        const totalNum = await db.Restaurant.count({})
        res.status(200).send(totalNum)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router