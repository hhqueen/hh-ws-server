const db = require('../models')
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
            const busId = "fIIgMDLnySfSodKMiuDwfA"
            const yelpData = await yelpAPI.returnYelpBusById(busId)
            const flatRestData = convertYelpRest(yelpData)
            const newRest = await db.Restaurant.create(flatRestData)
            
            const newHours = [
                {day:1, hasHH:true,start1:15,end1:18,start2:-1,end2:-1},
                {day:2, hasHH:true,start1:15,end1:18,start2:-1,end2:-1},
                {day:3, hasHH:true,start1:15,end1:18,start2:-1,end2:-1},
                {day:4, hasHH:true,start1:15,end1:18,start2:-1,end2:-1},
                {day:5, hasHH:true,start1:15,end1:18,start2:-1,end2:-1},
                {day:6, hasHH:true,start1:15,end1:18,start2:-1,end2:-1},
                {day:7, hasHH:true,start1:15,end1:18,start2:-1,end2:-1},
            ]

            newHours.forEach((hhHour) => {
                newRest.hours.push(hhHour)               
            })

            await newRest.save()
            console.log(newRest)

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
        dogFriendly: false,
        hasPatio: false,
        cuisines: [],
    }

    yelpData.categories.forEach((cat) => {
        restInfo.cuisines.push(cat.title)
    })

    console.log(restInfo)
    return restInfo
}

