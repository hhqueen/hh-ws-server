const axios = require("axios")

const yelpAPIsearch = async ({searchTerm, coordinates, location}) => {
    try {
        let yelpResponse = ""
        const header = {
            headers: {
                "Authorization": `Bearer ${process.env.YELP_API_KEY}`,
            }
        }
        
        // if (location.contains("%20")) {
        //     location = location.replace("%20", " ")
        // }

        if (location === "Current Location") {
            yelpResponse = await axios
                .get(`https://api.yelp.com/v3/businesses/search?term=${searchTerm}&latitude=${coordinates.lat}&longitude=${coordinates.long}`, header)
        } else {
            yelpResponse = await axios
                .get(`https://api.yelp.com/v3/businesses/search?term=${searchTerm}&location=${location}`, header)
        }

        // console.log(yelpResponse.data)

        return yelpResponse.data
    } catch (error) {
        console.log(error)
        return error
    }
}

const returnYelpBusById = async (busId) => {
    try {
        let yelpResponse = ""
        const header = {
            headers: {
                "Authorization": `Bearer ${process.env.YELP_API_KEY}`,
            }
        }
        yelpResponse = await axios
            .get(`https://api.yelp.com/v3/businesses/${busId}`, header)
        // console.log(yelpResponse.data)

        return yelpResponse.data
    } catch (error) {
        console.log(error)
    }
}

exports.yelpAPIsearch = yelpAPIsearch;
exports.returnYelpBusById = returnYelpBusById;
