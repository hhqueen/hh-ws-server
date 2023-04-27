const db = require("../models")

async function exec() {
    try {
        const allUsers = await db.User.find({})
        allUsers.forEach(async (user)=>{
            user.emailSubbed = true
            await user.save()
        })
        console.log('allUsers:', allUsers)
    } catch (error) {
        console.log(error)
    }

}

exec()