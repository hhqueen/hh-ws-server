const router = require("express").Router()
const db = require("../../models")

router.get("/RestaurantsPerCity", async (req,res)=>{
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

router.get("/dailyVistors", async (req,res)=>{
  try {
      console.log("dailyVistors EndPoint Hit")
      // const cityCount = await db.Restaurant.aggregate([
      //     {
      //       '$group': {
      //         '_id': '$city', 
      //         'numRestaurants': {
      //           '$count': {}
      //         }
      //       }
      //     }, {
      //       '$sort': {
      //         'numRestaurants': -1
      //       }
      //     }
      //   ])
      res.status(200).send()
  } catch (error) {
      res.status(400).json(error)
  }
})

module.exports = router