const router = require("express").Router()
const {forwardSearchByTerm} = require('../../services/positionStack')

router.get("/:term", async (req,res)=>{
    try {
        const responseLocation = await forwardSearchByTerm(req.params.term)
        res.status(200).json(responseLocation)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router