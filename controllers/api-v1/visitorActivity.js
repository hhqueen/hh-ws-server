const router = require("express").Router()
const db = require("../../models")


router.get("/", async (req, res) => {
    try {
        const getActivities = await db.VisitorActivity.find()
        res.status(200).json(getActivities)
    } catch (error) {
        console.log(error)
        res.status(501).json(error)
    }
})

router.post("/", async (req, res) => {
    try {
        // console.log("reqQuery", req.query)
        // const message = "post visitorActivity"
        const {
            userId, 
            restaurantId, 
            elementId, 
            value, 
            message, 
            url
        } = req.body
        // console.log("reqQuery", reqBody)
        // // console.log(message)
        // console.log
        // const foundUser = await db.User.findById(userId)
        const createdActivity = await db.VisitorActivity.create({
            userId: userId !== null ? await db.User.findById(userId) : null,
            restaurantId: restaurantId !== null ? await db.Restaurant.findById(restaurantId) : null,
            elementId,
            value,
            message,
            url
        })
        res.status(200).json(createdActivity)
    } catch (error) {
        console.log(error)
        res.status(501).json(error)
    }
})

module.exports = router