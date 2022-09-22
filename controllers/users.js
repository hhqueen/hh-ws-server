const router = require("express").Router()
const db = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/signup", async (req, res) => {
    try {
        res.send("post /sign up route")
    } catch (error) {
        console.log(error)
    }
})

router.post("/login", async (req, res) => {
    try {
        res.send("post /login route")
    } catch (error) {
        console.log(error)
    }
})

router.get("/profile/:userName", async (req, res) => {
    try {
        res.send("get /profile/:userName route")
    } catch (error) {
        console.log(error)
    }
})

router.put("/profile/:userName", async (req, res) => {
    try {
        res.send("put /profile/:userName route")
    } catch (error) {
        console.log(error)
    }
})


module.exports = router