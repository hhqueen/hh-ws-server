require("dotenv").config()
const db = require("./models") // connect to the db
const express = require("express")
const cors = require("cors")
const RequestIp = require('@supercharge/request-ip')

// app config/middleware
const app = express()
const PORT = process.env.PORT || 9000
app.use(cors())
app.use(express.json()) //json req.bodies
// static upload folder for images
app.use(express.static("uploads"))

async function expressMiddleware(req, res, next) {  
	console.log("middlewareREQ:", req)
	let reqBody_hidePassword = {
		hasPassword: false, 
		reqbody: {}
	}
	if(req.body.password) {
		reqBody_hidePassword.hasPassword = true
		reqBody_hidePassword.reqbody = req.body
		reqBody_hidePassword.reqbody.password = "***********"
	}
	const reqIp = RequestIp.getClientIp(req)
	const newAPI_Record = await db.APILog.create({
		ipAddress: reqIp,
		reqQuery: req.query,
		reqBody: reqBody_hidePassword.hasPassword ? reqBody_hidePassword.reqbody : req.body,
		reqParams: req.params,
		httpMethod: req.method,
		endPointURL: req.originalUrl
	})
	req.MiddlewareData = newAPI_Record
	// console.log("requestIP Address:",reqIp)
	next()
  }


app.use(expressMiddleware)  
app.get("/", (req, res) => {
	res.send("home route")
})

// Route specific middleware
app.use("/users", require("./controllers/api-v1/users"))
app.use("/restaurants", require("./controllers/api-v1/restaurants"))
app.use("/images", require("./controllers/api-v1/images"))
app.use("/locations", require("./controllers/api-v1/locations"))

app.listen(PORT, () => {
	console.log(`Vegeta: ITS OVER (PORT)${PORT}!?!?`)
})
