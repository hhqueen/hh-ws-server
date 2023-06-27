const router = require("express").Router()
const db = require("../../models")
const mailchimp = require('../../services/mailChimp')
const { boxCoordsFromlatLong, isCoordsInBox, miToKm } = require('../../functions/geoDistance')
const { ObjectId } = require('mongodb')

const geolib = require('geolib');

const {forwardSearchByTerm} = require('../../services/positionStack')

router.get("/", async (req, res) => {
  try {
    const allData = await db.APILog.find()
    res.status(200).json(allData)
  } catch (error) {
    console.log(error)
  }
})

router.get("/restaurant/:id", async (req, res) => {
  try {
    const restDataById = await db.Restaurant.findById(req.params.id)
    res.status(200).json(restDataById)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

router.get("/RestaurantsPerCity", async (req, res) => {
  try {
    console.log("RestaurantsPerCity EndPoint Hit")
    const cityCount = await db.Restaurant.aggregate([
      {
        '$group': {
          '_id': '$city',
          'numRestaurants': {
            '$count': {}
          }
        }
      }, {
        '$sort': {
          'numRestaurants': -1
        }
      }
    ])
    res.status(200).json(cityCount)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/TopThreeCitiesNearMe", async (req, res) => {
  try {
    let message = 'TopThreeCitiesNearMe route'
    const centerCoords = {
      latitude: Number(req.query.latitude),
      longitude: Number(req.query.longitude)
    }
    
    const distanceSteps = [1, 3, 5, 10 ,15, 20]
    const minNumOfCities = 3    
    let gotRestArr = []
    for(let i = 0;i < distanceSteps.length; i++ ){
      gotRestArr = await getRestaurants(distanceSteps[i])
      if (gotRestArr.length > minNumOfCities) {
        break;
      }
    }

    async function getRestaurants(distance) {
      const { posLat, negLat, posLong, negLong } = boxCoordsFromlatLong(centerCoords, miToKm(Number(distance)) * 1000)

      const cityCount = await db.Restaurant.aggregate([
        {
          $match: {
            $and: [
              { longitude: { $gt: negLong, $lt: posLong } },
              { latitude: { $gt: negLat, $lt: posLat } }
            ]
          }
        },
        {
          '$group': {
            '_id': {
              city: '$city',
              state: '$state'
            },
            'numRestaurants': {
              '$count': {}
            }
          }
        }, 
        // {
        //   '$sort': {
        //     'numRestaurants': -1
        //   }
        // }
      ])
      // console.log("cityCount", cityCount)
      return cityCount
    }

    let restDataRespArr = []

    await Promise.all(gotRestArr.map(async (item)=>{
      try {
        const {city, state} = item._id
        const geoForwardCityResp = await forwardSearchByTerm(`${city}, ${state}`)
        // console.log("geoForwardCityResp", geoForwardCityResp)
        const {latitude, longitude} = geoForwardCityResp[0]
        const cityCoords = {
          "latitude": latitude,
          "longitude":longitude
        }
        item.coordinates = cityCoords
        item.distanceFromCL = geolib.getDistance(cityCoords, centerCoords)
        console.log(item)
        restDataRespArr.push(item)
      } catch (error) {
        console.log(error)
      }
    }))

    restDataRespArr.sort((a, b) => {
      if (a.distanceFromCL < b.distanceFromCL) return -1
      if (a.distanceFromCL > b.distanceFromCL) return 1
      return 0
  })

    console.log("restDataRespArr", restDataRespArr)


    res.status(200).json(restDataRespArr)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/RestaurantVisits", async (req, res) => {
  try {
    // let listOfRestIdsArr = filteredBoxRestaurants.map((rest) => ObjectId(rest._id))
    let vistedData = await db.PageVisit.aggregate([
      {
        $match: {
          endPointURL: {
            $regex: 'https://hhqueen.com.*'
          }
        }
      },
      {
        $group: {
          _id: "$RestaurantId",
          numOfVisits: {
            $count: {},
          },
        }
      },
      {
        $sort: {
          numOfVisits: -1,
        }
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurantData",
        }
      }
    ])
    // .limit(limitNum)

    res.status(200).json(vistedData)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

router.get("/totalNumberOfRestaurants", async (req, res) => {
  try {
    const totalNum = await db.Restaurant.count({})
    res.status(200).json(totalNum)
  } catch (error) {
    console.log(error)
  }
})


router.get("/dailyVistors", async (req, res) => {
  try {
    console.log("dailyVistors EndPoint Hit")
    const pageVisits = await db.PageVisit.find({endPointURL: {$regex: "https://hhqueen.com.*"} })
    // console.log("vistors:",typeof vistors)
    // console.log("vistors:",vistors)

    // const filteredVistors = vistors.filter(i => i.endPointURL !== null && i.endPointURL.indexOf("developement") === -1)
    // console.log("filteredVistors:", filteredVistors)
    res.status(200).json(pageVisits)
  } catch (error) {
    console.log("/dailyVistors_error", error)
    res.status(400).json(error)
  }
})

router.get("/registeredProfiles", async (req, res) => {
  try {
    console.log("registeredProfiles EndPoint Hit")
    const registeredProfiles = await db.User.aggregate([
      {
        '$project': {
          'email': 1,
          'isActive': 1,
          'emailSubbed': 1,
          'createdAt': 1
        }
      }
    ])
    res.status(200).send(registeredProfiles)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/emailSubs", async (req, res) => {
  try {
    const getMembers = await mailchimp.GetListInfo()
    const data = getMembers.members
    let reducedData = []
    data.forEach((dataItem) => {
      reducedData.push({
        email_address: dataItem.email_address,
        timestamp_opt: dataItem.timestamp_opt,
        ip_opt: dataItem.ip_opt
      })
    })
    res.status(200).send(reducedData)
  } catch (error) {
    res.status(400).json(error)
  }
})



module.exports = router