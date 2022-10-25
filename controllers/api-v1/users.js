const router = require("express").Router()
const db = require("../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/signup", async (req, res) => {
    try {
        let emailError = ""
        let usernameError=""
        // check if the email exists already
		const findUserEmail = await db.User.findOne({email: req.body.email.toLowerCase()})
		if (findUserEmail) {
			// emailError = "E-mail"
			res.status(400).json({msg:"Email already exists, please try again."})
		}

        // check if the username exists already
        // const findUserUsername = await db.User.findOne({userName: req.body.userName.toLowerCase()})
        // if (findUserUsername) {usernameError= "Username"}
        
        // returns error message and disallows registering twice
        // let email_username_andString = ""
        // if (findUserEmail || findUserUsername) {
        //     if (findUserEmail && findUserUsername) {email_username_andString = " and "}
        //     msg = `${emailError}${email_username_andString}${usernameError} already exists, please try again.`
        //     return res.status(400).json({msg})
        // }

		// hash the user's password
		const password = req.body.password
		const saltRounds = 12
		const hashedPassword = await bcrypt.hash(password, saltRounds)

		// create a new user with the hashed password
		const newUser = new db.User({
			firstName: req.body.firstName.toLowerCase(),
			lastName: req.body.lastName.toLowerCase(),
			userName: req.body.userName.toLowerCase(),
			email: req.body.email.toLowerCase(),
            auth: "User",
			password: hashedPassword
		})
		await newUser.save()

		// sign the user in by sending a valid jwt back
		// create the jwt payload
		const payload = {
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			userName: newUser.userName,
			email: newUser.email,
            auth: newUser.auth,
			id: newUser.id
		}
		// sign the token and send it back
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }) // expires in one day
		res.json({ token })
	} catch (err) {
		console.warn(err)
		// handle validation errors
		if (err.name === "ValidationError") {
			res.status(400).json({ msg: err.message })
		} else {
			// handle all other errors
			res.status(500).json({ msg: 'server error 500' })
		}
	}
})

router.post("/login", async (req, res) => {
    try {
		// all the data will come in on the req.body
		// try to find the user in the database
		const foundUser = await db.User.findOne({
			email: req.body.email.toLowerCase()
		})
		const noLoginMessage = 'Incorrect email or password.'

		// if the user is not found, return send a status of 400 let the user know login failed
		if (!foundUser) {
			console.log('incorrect email', req.body)
			return res.status(400).json({ msg: noLoginMessage })
		}

		// check if the supplied password matches the hash in the db
		const passwordCheck = await bcrypt.compare(req.body.password, foundUser.password)
		// if they do not match, return and let the user know that login has failed
		if (!passwordCheck) {
			console.log('incorrect password', req.body)
			return res.status(400).json({ msg: noLoginMessage })
		}

		// create a jwt payload
		const payload = {
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			userName: foundUser.userName,
			email: foundUser.email,
            auth: foundUser.auth,
			id: foundUser.id
		}
		// sign the jwt and send it back
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
		res.json({ token })
	} catch (err) {
		// don't forget to handle your errors
		console.warn(err)
		res.status(500).json({ msg: 'Server room is on fire 🔥' })
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