const db = require("../models")

async function createEditRest(restaurantData) {
    // console.log("hits create new rest function module export")
    console.log("restaurantData:",restaurantData)
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
        },{
        upsert: true,
        new: true
    })
    newRestResponse.filterParams = restaurantData.filterParams
    console.log("newRestResponse:",newRestResponse)
    await newRestResponse.save()

    return newRestResponse
}



async function addEditHours(restaurantObject, hourSet) {
    console.log("passed_restaurantObject:",restaurantObject)
    console.log("passed_hourSet:",hourSet)
    console.log("hoursetId Bool:",hourSet._id !== undefined)
    let newHourSet 
    // console.log("hourSet._id:",restaurantObject.hourSet._id)
    if(hourSet._id !== undefined){ 
        newHourSet = await db.Hour.findOneAndUpdate({
            _id:restaurantObject.hourSet._id
        },{
            originalRestaurant:restaurantObject._id,
            description:"",
            hours: hourSet.hours,
        },{
            upsert: true,
            new: true
        })
    } else {
        newHourSet = await db.Hour.create({
            originalRestaurant:restaurantObject._id,
            description:"",
            hours: hourSet.hours,
        })
    }
    newHourSet.restaurants.push(restaurantObject._id)
    restaurantObject.hourSet = newHourSet
    await restaurantObject.save()
    await newHourSet.save()
    return 
}

async function addEditMainMenu(restaurantObject, menuObj) {
    console.log("addEditMenu_restaurantObject:",restaurantObject)
    console.log("addEditMenu_menuObj:",menuObj)
    try {
        let newMenu
        if (restaurantObject?.menu?._id !== undefined) {
            newMenu = await db.Menu.findOneAndUpdate({
                _id: restaurantObject.menu._id
            },{
                restaurantName:restaurantObject.name,
                isChain: menuObj.isChain,
                hasFoodSpecials: menuObj.hasFoodSpecials,
                foodMenuImg: menuObj.foodMenuImg,
                hasDrinkSpecials: menuObj.hasDrinkSpecials,
                drinkMenuImg: menuObj.drinkMenuImg,
                isFoodAndDrinkMenu: menuObj.isFoodAndDrinkMenu,
                foodAndDrinkMenuImg: menuObj.foodAndDrinkMenuImg
            },{
                upsert: true,
                new: true
            })
        } else {
            newMenu = await db.Menu.create({
                restaurantName:restaurantObject.name,
                isChain: menuObj.isChain,
                hasFoodSpecials: menuObj.hasFoodSpecials,
                foodMenuImg: menuObj.foodMenuImg,
                hasDrinkSpecials: menuObj.hasDrinkSpecials,
                drinkMenuImg: menuObj.drinkMenuImg,
                isFoodAndDrinkMenu: menuObj.isFoodAndDrinkMenu,
                foodAndDrinkMenuImg: menuObj.foodAndDrinkMenuImg
            })
        }
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
    } catch (error) {
        console.log(error)
    }
   
}

async function addEditFoodMenu(mainMenuObj, FoodMenuArr) {
    // console.log("hits Food Menu Function")
    if (FoodMenuArr.length > 0) {
        FoodMenuArr.forEach((item)=>{
            mainMenuObj.foodMenu.push(item)
        })
        return await mainMenuObj.save()
    }
}

async function addEditDrinkMenu(mainMenuObj, DrinkMenuArr) {
    // console.log("hits Drink Menu Function")
    DrinkMenuArr.forEach((item)=>{
        mainMenuObj.drinkMenu.push(item)
    })
    return await mainMenuObj.save()
}

async function addEditCusine(restaurantObject, cuisineArr) {
    // console.log("cuisineArr:",cuisineArr)
    let newCuisineArr = []
    cuisineArr.forEach((cuisine)=>{
        newCuisineArr.push(cuisine.title)
    })
    restaurantObject.cuisines = newCuisineArr
    // restaurantObject.cuisines = cuisineArr
    await restaurantObject.save()
    return 
}

module.exports = {
    createEditRest,
    addEditHours,
    addEditMainMenu,
    addEditFoodMenu,
    addEditDrinkMenu,
    addEditCusine
}