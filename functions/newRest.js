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
            { day: 3, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: -1, end2: -1, end2close: true }, // thurs
            { day: 4, hasHH1: true, start1: 15, end1: 18, end1close: false, hasHH2: false, start2: -1, end2: -1, end2close: true }, //friday
            { day: 5, hasHH1: false, start1: -1, end1: -1, end1close: false, hasHH2: false, start2: -1, end2: -1, end2close: true }, //sat
            { day: 6, hasHH1: false, start1: -1, end1: -1, end1close: false, hasHH2: true, start2: 22, end2: -1, end2close: true }, //sun
        ]
        newHours.forEach((hhHour) => {
            newRest.hours.push(hhHour)
        })

        const newMenu = await db.Menu.create({
            restaurantName: flatRestData.name,
            isChain: true,
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
                name: "FOUR CHEESE SPINACH DIP",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "MIGUEL'S QUESO DIP",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "POKE NACHOS",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "CHICKEN NACHOS",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "CHICKEN LETTUCE WRAPS",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "HAND-BATTERED CHICKEN TENDERS",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "CLASSIC SLIDERS",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "WISCONSIN FRIED CHEESE CURDS",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "BLACKENED AHI SASHIMI",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "FRIED CALAMARI",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "BONELESS WINGS",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "GARDEIN WINGS",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "CARNIVORE PIZZA",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "PEPPERONI & MUSHROOM PIZZA",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "THREE CHEESE PIZZA",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "MARGHERITA PIZZA",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
                isDollarsOff: false,
                dollarsOff: 0,
            },
            {
                name: "BBQ CHICKEN PIZZA",
                description: "",
                Type: "Food",
                isPrice: false,
                price: 0,
                isPercentDiscount: true,
                percentDiscout: 0.5,
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
                name: "DRAFT BEER, WINE, SPIRITS & COCKTAILS",
                description: "",
                Type: "Drink",
                isPrice: false,
                price: 0,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: true,
                dollarsOff: 2,
            },
            {
                name: "9oz WINE",
                description: "",
                Type: "Drink",
                isPrice: false,
                price: 0,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: true,
                dollarsOff: 3,
            },
            {
                name: "HALF YARDS",
                description: "",
                Type: "Drink",
                isPrice: false,
                price: 0,
                isPercentDiscount: false,
                percentDiscout: 0,
                isDollarsOff: true,
                dollarsOff: 4,
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

