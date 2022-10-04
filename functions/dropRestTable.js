const db = require('../models')

const dropRestTable = async () => {
    await db.Restaurant.deleteMany()
}
dropRestTable()