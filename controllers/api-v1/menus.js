const router = require("express").Router()

router.get("/", async (req,res)=>{

    res.send("menu / get")
})

module.exports = router