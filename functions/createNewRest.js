const db = require("../models")

async function createNewRest(restaurantData) {
    // console.log("hits create new rest function module export")
    // console.log(restaurantData)
    // const newRestResponse = await db.Restaurant.create({restaurantData})
    const {
        yelpRestaurantId,
        name,
        telNumber,
        displayNumber,
        address1,
        address2,
        address3,
        city,
        state,
        zip_code,
        country,
        longitude,
        latitude,
        image_url,
        hasDrinks,
        hasFood,
        dogFriendly,
        hasPatio
    } = restaurantData
    
    const newRestResponse = await db.Restaurant.findOneAndUpdate({
        yelpRestaurantId
        },{
            name,
            telNumber,
            displayNumber,
            address1,
            address2,
            address3,
            city,
            state,
            zip_code,
            country,
            longitude,
            latitude,
            image_url,
            hasDrinks,
            hasFood,
            dogFriendly,
            hasPatio
        },{
        upsert: true,
        new: true
    })

    return newRestResponse
}

async function addHours(restaurantObject, hourSet) {
    const newHourSet = await db.Hour.create({
        originalRestaurant:restaurantObject._id,
        description:"",
        hours: hourSet.hours,
        restaurants:[restaurantObject._id]
    })
    restaurantObject.hourSet = newHourSet
    await restaurantObject.save()
    return 
    
}

async function addMainMenu(restaurantObject, menuObj) {
    // console.log(restaurantObject)
    console.log("menuObj:",menuObj)      
    const newMenu = await db.Menu.create({
        restaurantName:restaurantObject.name,
        isChain: menuObj.isChain,
        hasFoodSpecials: menuObj.hasFoodSpecials,
        foodMenuImg: menuObj.foodMenuImg,
        hasDrinkSpecials: menuObj.hasDrinkSpecials,
        drinkMenuImg: menuObj.drinkMenuImg
    })
    restaurantObject.menu = newMenu
    newMenu.restaurant.push(restaurantObject)
    await restaurantObject.save()
    await newMenu.save()
    if (menuObj.foodMenuImg !== null) {
        const foundFoodMenuImg = await db.Image.findById(menuObj.foodMenuImg._id)
        foundFoodMenuImg.menu = newMenu._id
        await foundFoodMenuImg.save()
    }

    if (menuObj.drinkMenuImg !== null) {
        const foundDrinkMenuImg = await db.Image.findById(menuObj.foodMenuImg._id)
        foundDrinkMenuImg.menu = newMenu._id
        await foundDrinkMenuImg.save()
    }
    return newMenu
}

async function addFoodMenu(mainMenuObj, FoodMenuArr) {
    // console.log("hits Food Menu Function")
    FoodMenuArr.forEach((item)=>{
        mainMenuObj.foodMenu.push(item)
    })
    return await mainMenuObj.save()
}

async function addDrinkMenu(mainMenuObj, DrinkMenuArr) {
    // console.log("hits Drink Menu Function")
    DrinkMenuArr.forEach((item)=>{
        mainMenuObj.drinkMenu.push(item)
    })
    return await mainMenuObj.save()
}

async function addCusine(restaurantObject, cuisineArr) {
    console.log(restaurantObject)
    cuisineArr.forEach((cuisine)=>{
        restaurantObject.cuisines.push(cuisine.title)
    })
    console.log(restaurantObject.cuisines)
    return await restaurantObject.save()
}

module.exports = {
    createNewRest,
    addHours,
    addMainMenu,
    addFoodMenu,
    addDrinkMenu,
    addCusine
}