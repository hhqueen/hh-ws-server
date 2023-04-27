const router = require("express").Router()
const db = require("../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mailChimp = require("../../services/mailChimp")
const axios = require("axios")
const {toCamelCase} = require("../../functions/toCamelCase")

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
			emailSubbed:req.body.emailSub,
			password: hashedPassword
		})
		await newUser.save()

		// sign the user in by sending a valid jwt back
		// create the jwt payload
		// const toCamelCase = (s) =>{
		// 	return s && s[0].toUpperCase() + s.slice(1);
		// }

		const payload = {
			firstName: toCamelCase(newUser.firstName),
			lastName: toCamelCase(newUser.lastName),
			userName: toCamelCase(newUser.userName),
			email: toCamelCase(newUser.email),
            auth: newUser.auth,
			id: newUser.id,
			emailSubbed: newUser.emailSubbed
		}

		// add user to mailchimp subscribe
		if(req.body.emailSub === true){
			const mailChimpRes = await mailChimp.AddOneUser(payload,"subscribed")
			console.log("mailChimpRes:", mailChimpRes)
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
			res.status(500).json(err)
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
			firstName: toCamelCase(foundUser.firstName),
			lastName: toCamelCase(foundUser.lastName),
			userName: toCamelCase(foundUser.userName),
			email: toCamelCase(foundUser.email),
            auth: foundUser.auth,
			emailSubbed:req.body.emailSub,
			id: foundUser.id
		}
		// sign the jwt and send it back
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
		res.status(200).json({ token })
	} catch (err) {
		// don't forget to handle your errors
		console.warn(err)
		res.status(500).json({ msg: `Server room is on fire 🔥: ${err}` })
	}
})

router.get("/profile/:id", async (req, res) => {
    try {
		const foundProfile = await db.User.findById(req.params.id)
        res.status(200).json(foundProfile)
    } catch (error) {
        console.log(error)
		res.status(500).json({msg:`Error: ${error}`})
    }
})

router.put("/profile/:userName", async (req, res) => {
    try {
        res.send("put /profile/:userName route")
    } catch (error) {
        res.status(500).json({msg:`Error: ${error}`})
    }
})

router.put("/emailSubscribe/:userId", async (req,res)=>{
	try {
		const userId = req.params.userId
		console.log(`emailSubscribe reqbody ${userId}:`,req.body)
		// const mailChimpRes = await mailChimp.AddUpdateOneUser()
		// console.log("mailChimpRes:", mailChimpRes)
	} catch (error) {
		res.status(500).json({msg:`Error: ${error}`})
	}
})

router.put("/emailUnsubscribe/:userId", async (req,res)=>{
	try {
		
	} catch (error) {
		res.status(500).json({msg:`Error: ${error}`})
	}
})



// router.get("/mcGet", async (req,res) => {
// 	try {
// 		const getMailChimpResponse = await mailChimp.GetListInfo()
// 		res.send(getMailChimpResponse)
// 	} catch (error) {
// 		res.status(500).json(error)
// 	}
// })

router.post("/mcAddOneUser", async (req,res) => {
	try {
		const data = req.body
		const getMailChimpResponse = await mailChimp.AddOneUser(data.email_address,data.status)
		res.send(getMailChimpResponse)
	} catch (error) {
		res.status(500).json(error)
	}
})

router.put("/mcAddUpdateOneUser", async (req,res) => {
	try {
		// res.send("/mcAddUpdateOneUser ROUTE")
		// return
		console.log("mcAddUpdateOneUser")
		const data = req.body
		const getMailChimpResponse = await mailChimp.AddUpdateOneUser(data)
		res.send(getMailChimpResponse)
	} catch (error) {
		res.status(500).json(error)
	}
})

// router.post("/resetPassword", async (req,res) => {
// 	try {
// 		// WIP
// 		const unique_email_id = req.body.unique_email_id
// 		// res.send("/mcAddUpdateOneUser ROUTE")
// 		// return
// 		// console.log("mcAddUpdateOneUser")
// 		// const data = req.body
// 		// const getMailChimpResponse = await mailChimp.AddUpdateOneUser(data)
// 		const response = await axios.post(`https://us21.api.mailchimp.com/3.0/automations/a54abfc080/emails/75688e956c/queue&API_KEY=${process.env.MAILCHIMP_API_KEY}`, {unique_email_id})
// 		res.send(response)
// 	} catch (error) {
// 		console.warn(error)
// 		res.send(error)
// 	}
// })

module.exports = router