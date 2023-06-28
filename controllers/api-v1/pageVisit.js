const router = require("express").Router()
const db = require("../../models")
const RequestIp = require('@supercharge/request-ip')

// WIP
router.get("/", async (req, res) => {
    try {
        const getPageVisit = await db.PageVisit.find()
        res.status(200).json(getPageVisit)
    } catch (error) {
        console.log(error)
        res.status(501).json(error)
    }
})

router.post("/", async (req, res) => {
    try {
        // console.log("reqQuery", req.query)
        // const message = "post visitorActivity"
        // const {
        //     userId, 
        //     restaurantId, 
        //     elementId, 
        //     value, 
        //     message, 
        //     url
        // } = req.body
        // console.log("reqQuery", reqBody)
        // // console.log(message)
        // console.log
        // const foundUser = await db.User.findById(userId)
        const isMobile = (uadStr) => {
			return uadStr.indexOf("Mobile") != -1
		}
        const newPageVisit = await db.PageVisit.create({
            ipAddress: RequestIp.getClientIp(req),
            OS: req.query.OS ?? null,
            Mobile: isMobile(req.query.uad),
            Browser: req.query.browser ?? null,
            uad: req.query.uad ?? null,
            screenWidth: Number(req.query.screenWidth),
            ScreenHeight: Number(req.query.screenHeight),
            UserId: (userId !== null && userId !== "null") ? await db.Restaurant.findById(req.query.restaurantId) : null,
            RestaurantId: null,
            endPointURL: req.get('origin') + req.originalUrl
        })
        res.status(200).json(newPageVisit)
    } catch (error) {
        console.log(error)
        res.status(501).json(error)
    }
})

module.exports = router