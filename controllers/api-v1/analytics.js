const router = require("express").Router()
const db = require("../../models")
const mailchimp = require('../../services/mailChimp')

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
    res.status(200).send(cityCount)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/dailyVistors", async (req, res) => {
  try {
    console.log("dailyVistors EndPoint Hit")
    const vistors = await db.APILog.aggregate([
      {
        '$project': {
          modifiedBy: 1,
          ipAddress: 1,
          reqQuery: 1,
          createdAt: 1,
          executed_date: 1,
        }
      }
    ])
    res.status(200).send(vistors)
  } catch (error) {
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