require("dotenv").config()
const db = require("./models") // connect to the db
const express = require("express")
const cors = require("cors")
const onFinished = require('on-finished')
const RequestIp = require('@supercharge/request-ip')

// app config/middleware
const app = express()
const PORT = process.env.PORT || 9000
app.use(cors())
app.use(express.json()) //json req.bodies
// static upload folder for images
app.use(express.static("uploads"))

async function expressMiddleware(req, res, next) {
	// console.log("middlewareReq:", req)
	// console.log("findme!", req.get('origin'))
	// console.log("middlewareReqBody:", req.body)
	// console.log("middlewareReqQuery:", req.query)
	let reqBody_hidePassword = {
		hasPassword: false,
		reqbody: {}
	}
	if (req.body.password) {
		reqBody_hidePassword.hasPassword = true
		reqBody_hidePassword.reqbody = Object.assign({}, req.body)
		reqBody_hidePassword.reqbody.password = "***********"
	}

	let newAPI_Record
	try {
		// if (req.query.userId) userId = req.query.userId
		// if (req.body.userId) userId = req.body.userId
		let userId = null
		if (req.query.userId) { userId = req.query.userId }
		if (req.body.userId) { userId = req.body.userId }
		// const foundUser = userId !== null && userId !== "null" ? await db.User.findById(userId) : null
		let foundUser = null
		// console.log("userId:",userId)
		if (userId !== null && userId !== "null") {
			foundUser = await db.User.findById(userId)
		} else {
			foundUser = null
		}
		const originUrl = req.get('origin') + req.originalUrl

		newAPI_Record = await db.APILog.create({
			modifiedBy: foundUser,
			ipAddress: RequestIp.getClientIp(req),
			UI_ElementName: req.query.UI_ElementName,
			UI_ElementId: req.query.UI_ElementId,
			UI_ElementValue: req.query.UI_ElementValue,
			UI_ElementChecked: req.query.UI_ElementChecked,
			UI_ComponentName: req.query.UI_ComponentName,
			reqQuery: req.query,
			reqBody: reqBody_hidePassword.hasPassword ? reqBody_hidePassword.reqbody : req.body,
			reqParams: req.params,
			httpMethod: req.method,
			endPointURL: originUrl
		})


	} catch (error) {
		console.log(error)
	} finally {
		req.createdApiCall = newAPI_Record
	}
	next()
}


app.use(expressMiddleware)
app.use((req, res, next) => {
	onFinished(res, async (err) => {
		// console.log("onFinishedRes:",res.statusCode)
		// console.log("onFinishedErr:",err)
	})
	next()
})
app.get("/", (req, res) => {
	res.send("home route")
})

// Route specific middleware
app.use("/users", require("./controllers/api-v1/users"))
app.use("/restaurants", require("./controllers/api-v1/restaurants"))
app.use("/images", require("./controllers/api-v1/images"))
app.use("/locations", require("./controllers/api-v1/locations"))
app.use("/apiLogs", require('./controllers/api-v1/apiLogs'))
app.use("/analytics", require('./controllers/api-v1/analytics'))
app.use("/visitorActivity", require("./controllers/api-v1/visitorActivity"))
app.use("/pageVisit", require("./controllers/api-v1/pageVisit"))

app.listen(PORT, () => {
	console.log(`Vegeta: ITS OVER (PORT)${PORT}!?!?`)
})
