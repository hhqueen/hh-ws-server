const router = require("express").Router()

router.get("/", async (req, res) => {
    try {
        const message = "get visitorActivity"
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
    }
})

router.post("/", async (req, res) => {
    try {
        const message = "post visitorActivity"
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router