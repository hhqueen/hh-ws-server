const db = require("../models")
const { activityLogger, activityLogTemplate } = require('./activityLogger')
const { deepCopyObj } = require('./deepCopy')


async function createEditRest(restaurantData, apiCall) {
    // console.log("hits create new rest function module export")
    try {


        // console.log("restaurantData:", restaurantData)
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

        let restResponse
        restResponse = await db.Restaurant.findOne({ yelpRestaurantId })
        // console.log("restResponse:",restResponse)

        if (!restResponse) {
            restResponse = await db.Restaurant.findOneAndUpdate({
                yelpRestaurantId
            }, {
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
            }, {
                upsert: true,
                new: true
            })

            await activityLogger({
                DB_changes_collectionName: "Restaurant",
                DB_changes_documentId: restResponse._id.valueOf(),
                DB_changes_newValue: restResponse,
                apiCall
            })
        }

        restaurantData.filterParams.forEach(async (newFilterItem) => {
            try {
                let oldFilterItem = { value: null }
                let filterIndex = restResponse.filterParams.findIndex((item) => {
                    return item.name === newFilterItem.name
                })

                if (filterIndex > -1) {
                    if (restResponse.filterParams[filterIndex].value === newFilterItem.value) return
                    oldFilterItem = deepCopyObj(restResponse.filterParams[filterIndex])
                    restResponse.filterParams[filterIndex] = newFilterItem
                } else {
                    restResponse.filterParams.push(newFilterItem)
                    filterIndex = restResponse.filterParams.findIndex(item => item.name == newFilterItem.name)
                }

                await activityLogger({
                    DB_changes_collectionName: "FilterParams",
                    DB_changes_documentId: restResponse.filterParams[filterIndex]._id.valueOf(),
                    DB_changes_previousValue: oldFilterItem,
                    DB_changes_newValue: restResponse.filterParams[filterIndex],
                    apiCall
                })

            } catch (error) {
                console.log(error)
            }
        })
        // console.log("newRestResponse:", restResponse)
        await restResponse.save()
        return restResponse

    } catch (error) {
        console.log(error)
    }
}



async function addEditHours(restaurantObject, hourSet, apiCall) {
    try {
        // console.log("passed_restaurantObject:", restaurantObject)
        // console.log("passed_hourSet:", hourSet)
        // console.log("hoursetId Bool:", hourSet._id !== undefined)
        let newHourSet
        let prevHourSet = null
        let content = {
            originalRestaurant: restaurantObject._id,
            description: "",
            hours: hourSet.hours
        }
        let emptyHoursContent = {
            originalRestaurant: restaurantObject._id,
            description: "",
            hours: []
        }

        if (hourSet._id !== undefined) {
            let filter = { _id: restaurantObject.hourSet._id }
            let options = {
                upsert: true,
                new: true
            }
            // prev code
            prevHourSet = await db.Hour.findById(filter)
            newHourSet = await db.Hour.findOneAndUpdate(filter, content, options) 

        } else {
            newHourSet = await db.Hour.create(content)
        }

        await activityLogger({
            DB_changes_collectionName: "HourSet",
            DB_changes_documentId: newHourSet._id.valueOf(),
            DB_changes_previousValue: prevHourSet,
            DB_changes_newValue: newHourSet,
            apiCall
        })

        newHourSet.restaurants.push(restaurantObject._id)
        restaurantObject.hourSet = newHourSet
        await restaurantObject.save()
        await newHourSet.save()
        return
    } catch (error) {
        console.log(error)
    }

}

async function addEditMainMenu(restaurantObject, menuObj, apiCall) {
    console.log("addEditMenu_restaurantObject:", restaurantObject)
    console.log("addEditMenu_menuObj:", menuObj)
    try {
        let newMenu
        let prevMenu = null
        if (restaurantObject?.menu?._id !== undefined) {
            prevMenu = await db.Menu.findById({_id: restaurantObject.menu._id})
            newMenu = await db.Menu.findOneAndUpdate({
                _id: restaurantObject.menu._id
            }, {
                restaurantName: restaurantObject.name,
                isChain: menuObj.isChain,
                hasFoodSpecials: menuObj.hasFoodSpecials,
                foodMenuImg: menuObj.foodMenuImg,
                hasDrinkSpecials: menuObj.hasDrinkSpecials,
                drinkMenuImg: menuObj.drinkMenuImg,
                isFoodAndDrinkMenu: menuObj.isFoodAndDrinkMenu,
                foodAndDrinkMenuImg: menuObj.foodAndDrinkMenuImg
            }, {
                upsert: true,
                new: true
            })
        } else {
            newMenu = await db.Menu.create({
                restaurantName: restaurantObject.name,
                isChain: menuObj.isChain,
                hasFoodSpecials: menuObj.hasFoodSpecials,
                foodMenuImg: menuObj.foodMenuImg,
                hasDrinkSpecials: menuObj.hasDrinkSpecials,
                drinkMenuImg: menuObj.drinkMenuImg,
                isFoodAndDrinkMenu: menuObj.isFoodAndDrinkMenu,
                foodAndDrinkMenuImg: menuObj.foodAndDrinkMenuImg
            })
        }

        await activityLogger({
            DB_changes_collectionName: "Menu",
            DB_changes_documentId: newMenu._id.valueOf(),
            DB_changes_previousValue: prevMenu,
            DB_changes_newValue: newMenu,
            apiCall
        })
        
        // console.log("addEditMainMenu_newMenu", newMenu)
        restaurantObject.menu = newMenu
        newMenu.restaurant.push(restaurantObject)
        await restaurantObject.save()
        await newMenu.save()
        if (!menuObj.foodMenuImg === null) {
            const foundFoodMenuImg = await db.Image.findById(menuObj.foodMenuImg._id)
            foundFoodMenuImg.menu = newMenu._id
            await foundFoodMenuImg.save()
        }

        if (!menuObj.drinkMenuImg === null) {
            const foundDrinkMenuImg = await db.Image.findById(menuObj.foodMenuImg._id)
            foundDrinkMenuImg.menu = newMenu._id
            await foundDrinkMenuImg.save()
        }
        return newMenu
    } catch (error) {
        console.log(error)
    }

}

async function addEditFoodMenu(mainMenuObj, FoodMenuArr, apiCall) {
    // console.log("hits Food Menu Function")
    console.log("addEditFoodMenu_mainMenuObj:", mainMenuObj)
    console.log("addEditFoodMenu_FoodMenuArr:", FoodMenuArr)
    if (FoodMenuArr.length > 0) {
        FoodMenuArr.forEach((item) => {
            mainMenuObj.foodMenu.push(item)
        })
        return await mainMenuObj.save()
    }
}

async function addEditDrinkMenu(mainMenuObj, DrinkMenuArr, apiCall) {
    // console.log("hits Drink Menu Function")
    console.log("addEditDrinkMenu_mainMenuObj:", mainMenuObj)
    console.log("addEditDrinkMenu_DrinkMenuArr:", DrinkMenuArr)
    DrinkMenuArr.forEach((item) => {
        mainMenuObj.drinkMenu.push(item)
    })
    return await mainMenuObj.save()
}

async function addEditCusine(restaurantObject, cuisineArr, apiCall) {
    console.log("cuisineArr:", cuisineArr)
    console.log("addEditCusine_restaurantObject:", restaurantObject)
    if (restaurantObject.cuisines.length == 0) {
        if (cuisineArr[0].title) {
            cuisineArr.forEach((cuisine) => {
                restaurantObject.cuisines.push(cuisine.title)
            })
        } else {
            restaurantObject.cuisines = cuisineArr
        }

        await restaurantObject.save()
    }
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