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
        const busId = "uZqBQCiyZC3owwct3CUJkA"
        const yelpData = await yelpAPI.returnYelpBusById(busId)
        const flatRestData = convertYelpRest(yelpData)
        const newRest = await db.Restaurant.create(flatRestData)

        const newHours = [
            { day: 0, hasHH1: true, start1: 16.5, end1: 18.5, end1close: false, hasHH2: true, start2: 21, end2: -1, end2close: true }, //monday
            { day: 1, hasHH1: true, start1: 16.5, end1: 18.5, end1close: false, hasHH2: true, start2: 21, end2: -1, end2close: true }, //tuesday
            { day: 2, hasHH1: true, start1: 16.5, end1: 18.5, end1close: false, hasHH2: true, start2: 21, end2: -1, end2close: true }, //weds
            { day: 3, hasHH1: true, start1: 16.5, end1: 18.5, end1close: false, hasHH2: true, start2: 21, end2: -1, end2close: true }, // thurs
            { day: 4, hasHH1: false, start1: -1, end1: -1, end1close: false, hasHH2: true, start2: 21, end2: -1, end2close: true }, //friday
            { day: 5, hasHH1: false, start1: -1, end1: -1, end1close: false, hasHH2: true, start2: 21, end2: -1, end2close: true }, //sat
            { day: 6, hasHH1: true, start1: 16.5, end1: 18, end1close: false, hasHH2: true, start2: 21, end2: -1, end2close: true }, //sun
        ]
        newHours.forEach((hhHour) => {
            newRest.hours.push(hhHour)
        })

        const newMenu = await db.Menu.create({
            restaurantName: flatRestData.name,
            isChain: false,
            hasFoodSpecials: true,
            hasDrinkSpecials: true,
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
            {
                name: "POLPETTE AL SUGO",
                description: "Napoletana-style meatballs",
                Type: "Food",
                isPrice: true,
                price: 13,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "BRUSCHETTA CLASSICA",
                description: "",
                Type: "Food",
                isPrice: true,
                price: 7,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "PROSCIUTTO & PARMIGIANO",
                description: "sliced prosciutto, Parmigiano-Reggiano cheese, giardiera",
                Type: "Food",
                isPrice: true,
                price: 11,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "PIZZETTA DIAVOLA BIANCA",
                description: "flatbread topped with mozzarella di bufala, Napoletana-style spicy salame",
                Type: "Food",
                isPrice: true,
                price: 9,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "PIZZETTA ALLE MELANZANE",
                description: "Flat bread topped with eggplant, gorgonzola cheese, mozzarella di bufala, DOP pomodoro sauce, basil, EVOO",
                Type: "Food",
                isPrice: true,
                price: 9,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "BRESAOLA & UBRIACO",
                description: "Sliced bresaola, Ubriaco di Piave cheese, giardiera",
                Type: "Food",
                isPrice: true,
                price: 10,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "BURRATA & POMODORI",
                description: "burrata, heirloom tomatoes, Taggiasca olives, basil",
                Type: "Food",
                isPrice: true,
                price: 11,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
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
            {
                name: "WINE",
                description: "Red, White, Prosecco",
                Type: "Drink",
                isPrice: true,
                price: 10,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "BEER",
                description: "All Beers",
                Type: "Drink",
                isPrice: true,
                price: 6,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "APEROL SPRTIZ",
                description: "Aperol, Prosecco, soda water",
                Type: "Drink",
                isPrice: true,
                price: 10,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "IL DOTTORE",
                description: "Vodka, lemongrass syrup, simple syrup, ginger",
                Type: "Drink",
                isPrice: true,
                price: 10,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "OLD FASHIONED",
                description: "Bourbon, bitters, demerara",
                Type: "Drink",
                isPrice: true,
                price: 10,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "SIDECAR",
                description: "Copper and Kings Brandy, triple sec, lemon",
                Type: "Drink",
                isPrice: true,
                price: 10,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "MANHATTAN",
                description: "Rye Whiskey, vermouth, bitters",
                Type: "Drink",
                isPrice: true,
                price: 10,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "WELL LIBATIONS",
                description: "Vodka, Gin, Rum, Tequila, Bourbon, Rye Whiskey",
                Type: "Drink",
                isPrice: true,
                price: 10,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: false,
                dollarsOff: 0,
            },
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

