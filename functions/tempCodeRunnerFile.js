const db = require('../models')
const { forEach } = require('../seeding/seedRestData.js')
const restData = require('../seeding/seedRestData.js')
const yelpAPI = require('../services/yelpAPI')

const newRest = async () => {
    try {
        restData.forEach(async (restaurant) => {
            const flatRestData = convertYelpRest(restaurant)
            await db.Restaurant.create(flatRestData)
        })
    } catch (error) {
        console.log(error)
    }
}
// newRest()

// searches by yelp Id and adds to db
const newRestByID = async () => {
    try {
            const busId = "pm1SGfjnSDIDw-1W1XbCSQ"
            const yelpData = await yelpAPI.returnYelpBusById(busId)
            const flatRestData = convertYelpRest(yelpData)
            await db.Restaurant.create(flatRestData)
    } catch (error) {
        console.log(error)
    }
}
newRestByID()


// function that flattens yelp API data for mongodb 
const convertYelpRest = (yelpData) => {
    console.log("yelpData:", yelpData)
    let restInfo = {
        yelpRestaurantId: yelpData.id,
        name: yelpData.name,
        telNumber: yelpData.phone,
        displayNumber: yelpData.display_phone,
        address1: yelpData.location.address1,
        address2: yelpData.location.address2,
        address3: yelpData.location.address3,
        city: yelpData.location.city,
        zip_code: yelpData.location.zip_code,
        country: yelpData.location.country,
        state: yelpData.location.state,
        latitude: yelpData.coordinates.latitude,
        longitude: yelpData.coordinates.longitude,
        image_url: yelpData.image_url,
        hasDrinks: true,
        hasFood: true,
        dogFriendly: true,
        hasPatio: true,
        cuisines: [],
    }

    yelpData.categories.forEach((cat) => {
        restInfo.cuisines.push(cat.title)
    })

    console.log(restInfo)
    return restInfo
}

