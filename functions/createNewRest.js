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

async function addHours(restaurantObject, HoursArr) {
    HoursArr.forEach((hhHour) => {
        restaurantObject.hours.push(hhHour)
    })
    await restaurantObject.save()
    return 
}

async function addMainMenu(restaurantObject, menuObj) {
    
    // console.log(restaurantObject)
    // console.log(menuObj)
    const {
        restaurantName,
        isChain,
        hasFoodSpecials,
        foodSpecialsDescriptions,
        hasDrinkSpecials,
        drinkSpecialsDescriptions
    } = menuObj
       
    const newMenu = await db.Menu.create({
        restaurantName,
        isChain,
        hasFoodSpecials,
        foodSpecialsDescription: foodSpecialsDescriptions,
        hasDrinkSpecials,
        drinkSpecialsDescription: drinkSpecialsDescriptions,
        restaurantName:restaurantObject.name,
    })
    restaurantObject.menu = newMenu
    newMenu.restaurant.push(restaurantObject)
    await restaurantObject.save()
    await newMenu.save()
    return newMenu
}

async function addFoodMenu(mainMenuObj, FoodMenuArr) {
    console.log("hits Food Menu Function")
    FoodMenuArr.forEach((item)=>{
        mainMenuObj.foodMenu.push(item)
    })
    return await mainMenuObj.save()
}

async function addDrinkMenu(mainMenuObj, DrinkMenuArr) {
    console.log("hits Drink Menu Function")
    DrinkMenuArr.forEach((item)=>{
        mainMenuObj.drinkMenu.push(item)
    })
    return await mainMenuObj.save()
}

async function addCusine() {

}

module.exports = {
    createNewRest,
    addHours,
    addMainMenu,
    addFoodMenu,
    addDrinkMenu,
    addCusine
}