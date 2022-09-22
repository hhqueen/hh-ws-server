const db = require('../models')
const restData = require('../seeding/seedRestData.js')

console.log(restData)

const newRest = async () => {
    try {
        restData.forEach( async (restaurant) => {
            await db.Restaurant.create(restaurant)
        })
    } catch (error) {
        console.log(error)
    }
}
newRest()