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
        const busId = "dNvvKds1D5MQM8bNfSuUfA"
        const yelpData = await yelpAPI.returnYelpBusById(busId)
        const flatRestData = convertYelpRest(yelpData)
        const newRest = await db.Restaurant.create(flatRestData)

        const newHours = [
            { day: 0, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: true, start2: 22, end2: -1, end2close: true }, //monday
            { day: 1, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: true, start2: 22, end2: -1, end2close: true }, //tuesday
            { day: 2, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: true, start2: 22, end2: -1, end2close: true }, //weds
            { day: 3, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 22, end2: -1, end2close: true }, // thurs
            { day: 4, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: 22, end2: -1, end2close: true }, //friday
            { day: 5, hasHH1: false, start1: -1, end1: -1, end1close: false, hasHH2: false, start2: 22, end2: -1, end2close: true }, //sat
            { day: 6, hasHH1: false, start1: -1, end1: -1, end1close: false, hasHH2: true, start2: 22, end2: -1, end2close: true }, //sun
        ]
        newHours.forEach((hhHour) => {
            newRest.hours.push(hhHour)
        })

        const newMenu = await db.Menu.create({
            restaurantName: flatRestData.name,
            "isChain": false,
            "hasFoodSpecials": true,
            "foodSpecialsDescription": "1/2 OFF Select Apps & All Pizzas",
            "hasDrinkSpecials": true,
            "drinkSpecialsDescription":"2$ Off Draft Beer, Wine, Spirits & Coctails. $3 Off 9oz Wine. $4 Off Half Yards.",
        })
        newRest.menu = newMenu
        newMenu.restaurant.push(newRest)
        // newRest.menu = newMenu
        
        //Food Item template:
        //     {
        //         name:"",
        //         Type:"Food",
        //         isPrice:false,
        //         price:0,
        //         isPercentDiscount:false,
        //         percentDiscout:0,
        //         isDollarsOff: false,
        //         dollarsOff: 0,
        // },
        const newFoodItems = [
            // {
            //     name: "",
            //     description: "",
            //     Type: "Food",
            //     isPrice: false,
            //     price: 0,
            //     isPercentDiscount: false,
            //     percentDiscout: 0,
            //     isDollarsOff: false,
            //     dollarsOff: 0,
            // },
            // {
            //     "name": "POLPETTE AL SUGO",
            //     "description": "Napoletana-style meatballs",
            //     "value": 13,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "BRUSCHETTA CLASSICA",
            //     "description": "",
            //     "value": 7,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "PROSCIUTTO & PARMIGIANO",
            //     "description": "sliced prosciutto, Parmigiano-Reggiano cheese, giardiera",
            //     "value": 11,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "PIZZETTA DIAVOLA BIANCA",
            //     "description": "flatbread topped with mozzarella di bufala, Napoletana-style spicy salame",
            //     "value": 9,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "PIZZETTA ALLE MELANZANE",
            //     "description": "Flat bread topped with eggplant, gorgonzola cheese, mozzarella di bufala, DOP pomodoro sauce, basil, EVOO",
            //     "value": 9,
            //     "specialTypeId": 1,
                
            // },
            // {
            //     "name": "BRESAOLA & UBRIACO",
            //     "description": "Sliced bresaola, Ubriaco di Piave cheese, giardiera",
            //     "value": 10,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "BURRATA & POMODORI",
            //     "description": "burrata, heirloom tomatoes, Taggiasca olives, basil",
            //     "value": 11,
            //     "specialTypeId": 1,
            // }
        ]

        newFoodItems.forEach((item)=>{
            newMenu.foodMenu.push(item)
        })

        //Drink Item template:
        //     {
        //         name:"",
        //         Type:"Drink",
        //         isPrice:false,
        //         price:0,
        //         isPercentDiscount:false,
        //         percentDiscout:0,
        //         isDollarsOff: false,
        //         dollarsOff: 0,
        // },
        const newDrinkItems = [
            // {
            //     "name": "WINE",
            //     "description": "Red, White, Prosecco",
            //     "value": 10,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "BEER",
            //     "description": "All Beers",
            //     "value": 6,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "APEROL SPRTIZ",
            //     "description": "Aperol, Prosecco, soda water",
            //     "value": 10,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "IL DOTTORE",
            //     "description": "Vodka, lemongrass syrup, simple syrup, ginger",
            //     "value": 10,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "OLD FASHIONED",
            //     "description": "Bourbon, bitters, demerara",
            //     "value": 10,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "SIDECAR",
            //     "description": "Copper and Kings Brandy, triple sec, lemon",
            //     "value": 10,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "MANHATTAN",
            //     "description": "Rye Whiskey, vermouth, bitters",
            //     "value": 10,
            //     "specialTypeId": 1,
            // },
            // {
            //     "name": "WELL LIBATIONS",
            //     "description": "Vodka, Gin, Rum, Tequila, Bourbon, Rye Whiskey",
            //     "value": 10,
            //     "specialTypeId": 1,
            // }
        ]

        newDrinkItems.forEach((item)=>{
            newMenu.drinkMenu.push(item)
        })

        await newRest.save()
        await newMenu.save()
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
        alias:yelpData.alias,
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

