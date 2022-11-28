require("dotenv").config()
const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/hhQueen"

mongoose.connect(MONGODB_URI)

const db = mongoose.connection

db.once("open", () => {
	console.log(`⛓ connected to MongoDB @ ${db.host}:${db.port}`)
})

db.on("error", (err) => {
	console.error("Database is not very happy 😭", err)
})

module.exports = {
	// This is where the DB models are exported.
	User: require("./user"),
    Restaurant: require('./restaurant'),
	Menu: require('./menu'),
	Image: require('./image')
}
