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
        console.log("reqQuery", req.query)
        console.log("reqBody", req.body)

        const isMobile = (uadStr) => {
			return uadStr.indexOf("Mobile") != -1
		}
        const newPageVisit = await db.PageVisit.create({
            ipAddress: RequestIp.getClientIp(req),
            OS: req.body.OS ?? null,
            Mobile: isMobile(req.body.uad),
            Browser: req.body.browser ?? null,
            uad: req.body.uad ?? null,
            screenWidth: Number(req.body.screenWidth),
            ScreenHeight: Number(req.body.screenHeight),
            endPointURL: req.body.url,
            RestaurantId: (req.body.restaurantId !== null && req.body.restaurantId !== "null") ? await db.Restaurant.findById(req.body.restaurantId) : null,
            UserId: (req.body.userId !== null && req.body.userId !== "null") ? await db.User.findById(req.body.userId) : null,
        })
        res.status(200).json(newPageVisit)
    } catch (error) {
        console.log(error)
        res.status(501).json(error)
    }
})

module.exports = router