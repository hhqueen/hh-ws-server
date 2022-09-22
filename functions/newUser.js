const db = require('../models')
const userData = require('../seeding/seedUserData.js')

console.log(userData)

const newUsers = async () => {
    try {
        userData.forEach( async (person) => {
            await db.User.create(person)
        })
    } catch (error) {
        console.log(error)
    }
}
newUsers()