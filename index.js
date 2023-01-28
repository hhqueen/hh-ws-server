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
	// console.log("middlewareREQ:", req)
	let reqBody_hidePassword = {
		hasPassword: false, 
		reqbody: {}
	}
	if(req.body.password) {
		reqBody_hidePassword.hasPassword = true
		reqBody_hidePassword.reqbody = Object.assign({},req.body)
		reqBody_hidePassword.reqbody.password = "***********"
	}
	let newAPI_Record
	try {
		newAPI_Record = await db.APILog.create({
			ipAddress: RequestIp.getClientIp(req),
			reqQuery: req.query,
			reqBody: reqBody_hidePassword.hasPassword ? reqBody_hidePassword.reqbody : req.body,
			reqParams: req.params,
			httpMethod: req.method,
			endPointURL: req.originalUrl
		})
	} catch (error) {
		// newAPI_Record = await db.APILog.create({
		// 	ipAddress: RequestIp.getClientIp(req),
		// 	reqQuery: req.query,
		// 	reqBody: reqBody_hidePassword.hasPassword ? reqBody_hidePassword.reqbody : req.body,
		// 	reqParams: req.params,
		// 	httpMethod: req.method,
		// 	endPointURL: req.originalUrl,
		// 	error: error
		// })
		console.log(error)
	}
	req.createdApiRecord = newAPI_Record

	next()
  }


app.use(expressMiddleware)  
app.use((req,res, next)=>{
	onFinished(res,async(err)=>{
		console.log("onFinishedRes:",res.statusCode)
		console.log("onFinishedErr:",err)
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

app.listen(PORT, () => {
	console.log(`Vegeta: ITS OVER (PORT)${PORT}!?!?`)
})
