const router = require("express").Router()
const {forwardSearchByTerm} = require('../../services/positionStack')

router.get("/:term", async (req,res)=>{
    try {
        console.log("locations_reqParams-Term:",req.params.term)
        const responseLocation = await forwardSearchByTerm(req.params.term)
        console.log(responseLocation)
        res.status(responseLocation.response.status).json(responseLocation)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router