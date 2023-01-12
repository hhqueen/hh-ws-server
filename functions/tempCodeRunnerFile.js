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
            const busId = "pm1SGfjnSDIDw-1W1XbCSQ"
            const yelpData = await yelpAPI.returnYelpBusById(busId)
            const flatRestData = convertYelpRest(yelpData)
            await db.Restaurant.create(flatRestData)
    } catch (error) {
        console.log(error)
    }
}
// newRestByID()


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

const addHourSetFunction = () => {
    const defaultHours = {
        hours:
            [
                { day: 0, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 21, end2: 0, end2close: false }, //monday
                { day: 1, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 21, end2: 0, end2close: false }, //tuesday
                { day: 2, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 21, end2: 0, end2close: false }, //weds
                { day: 3, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 21, end2: 0, end2close: false }, // thurs
                { day: 4, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 21, end2: 0, end2close: false }, //friday
                { day: 5, hasHH1: false, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 21, end2: 0, end2close: false }, //sat
                { day: 6, hasHH1: false, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 21, end2: 0, end2close: false }, //sun
            ]
        }
    const restArrIds = ['639d009fcc42bfe76aad7f14', "639d02b7cc42bfe76aafcae5", "63a3e8dccc42bfe76a093056"]
    restArrIds.forEach( async (id)=>{
        try {
            const newHourSet = await db.Hour.create(defaultHours)
            const foundRest = await db.Restaurant.findById(id)
            foundRest.hourSet = newHourSet
            await foundRest.save()
            console.log(foundRest)
        } catch (error) {
            console.log(error)
        }
    })
}

// addHourSetFunction()

const reGetAllRestaurantCuisinesFromYelp = async () => {
    try {
        // const allRestaurants = await db.Restaurant.find({},{_id:1,yelpRestaurantId:1})
        // console.log(allRestaurants)

        
        const foundRest = await db.Restaurant.findById("63a1309bcc42bfe76a20bc96")
        const yelpData = await yelpAPI.returnYelpBusById(foundRest.yelpRestaurantId)
        
        // console.log(yelpData)
        foundRest.cuisines = []
        yelpData.categories.forEach((cat)=>{
            foundRest.cuisines.push(cat.title)
        })
        await foundRest.save()
        console.log(foundRest)

        // allRestaurants.forEach(async (rest,idx)=>{
        //     const functionTime = async (rest) =>{
        //         try {
        //             const yelpData = await yelpAPI.returnYelpBusById(rest.yelpRestaurantId)
        //             console.log(yelpData)
        
        //             } catch (error) {
        //                 console.log(error)
        //             }
        //     }
        //     setTimeout(await functionTime(rest),1000)
        // })
    } catch (error) {
        console.log(error)
    }


    // console.log(allRestaurants)
}

// reGetAllRestaurantCuisinesFromYelp()

const addFields = async () => {
    // const allRest = db.Restaurant.find({})
    const allHours = await db.Hour.find({})
    allHours.forEach(async (hour)=>{
        hour.hours.forEach((obj)=>{
            obj.isAllDay = false
            obj.isAllNight = false
        })
        await hour.save()
    })
    console.log("allHours",allHours)
}

addFields()