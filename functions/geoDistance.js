const {isNumber, isObject} = require('./typeChecker')
const geolib = require('geolib');

const kmPerMile = 1.60934

// private functions
const kmToMi = (num) =>{
    if (!isNumber(num)) return Error(`incorrect type, expecting number`)
    return num / kmPerMile
}

const miToKm = (num) =>{
    if (!isNumber(num)) return Error(`incorrect type, expecting number`)
    return num * kmPerMile

}

const boxCoordsFromlatLong = (coordinates = {latitude: null, longitude: null}, distanceMeters = null) =>{
    // type checking code (WIP)
    // if(!isObject(coordinates)) return Error('Coordinates not an object')
    // if(!isNumber(distanceMeters)) return Error('distance meter not an object')
    // const objKeys = Object.keys(coordinates)
    // if(!objKeys.indexOf('latitude')) return Error('latitude key not found in coordinate Object')

    let boxCoords = {
        posLat: geolib.computeDestinationPoint(coordinates, distanceMeters, 0).latitude,
        posLong: geolib.computeDestinationPoint(coordinates, distanceMeters, 90).longitude,
        negLat: geolib.computeDestinationPoint(coordinates, distanceMeters, 180).latitude,
        negLong: geolib.computeDestinationPoint(coordinates, distanceMeters, -90).longitude,
    }
    return boxCoords
}

const isCoordsInBox = (
    // init variable
    coordinates = {latitude: null, longitude: null}, 
    boxCoords = {
        posLat: null,
        posLong: null,
        negLat: null,
        negLong: null
    }
    ) =>{

    // obj deconstruct 
    const {latitude, longitude} = coordinates
    const {posLat, posLong, negLat, negLong} = boxCoords

    // check if lat and long is within passed box coords, if so return true
    if(latitude < posLat && latitude > negLat && longitude < posLong && longitude > negLong) return true
    
    // else return false
    return false

}

const decToDist = (deciLatitude, deciLongitude, radiusDistance, distanceType) => {
    let finalCoord = {
        posLat: 0,
        negLat: 0,
        posLong: 0,
        negLong: 0
    }

    let milePerDegreeLatitude = 69
    let milePerDegreeLongitude = 54.6
    let kmPerMi = 1.60934

    if (distanceType = "mi") {
        // find new distance (mi) and convert back to deci
        // finalCoord.posLat = ((deciLatitude * milePerDegreeLatitude) + radiusDistance) / milePerDegreeLatitude
        // finalCoord.negLat = ((deciLatitude * milePerDegreeLatitude) - radiusDistance) / milePerDegreeLatitude
        // finalCoord.posLong = ((deciLongitude * milePerDegreeLatitude) + radiusDistance) / milePerDegreeLongitude
        // finalCoord.negLong = ((deciLongitude * milePerDegreeLatitude) - radiusDistance) / milePerDegreeLongitude

        finalCoord.posLat =  deciLatitude + (radiusDistance / milePerDegreeLatitude)
        finalCoord.negLat =  deciLatitude - (radiusDistance / milePerDegreeLatitude)
        finalCoord.posLong = deciLongitude + (radiusDistance / milePerDegreeLongitude)
        finalCoord.negLong = deciLongitude - (radiusDistance / milePerDegreeLongitude)
    } else if (distanceType = "km") {
        // // find new distance (km) and convert back to deci
        // finalDeciLatitude = deciLatitude * milePerDegreeLatitude *
        // finalDeciLongitude = deciLongitude * milePerDegreeLongitude  *
        console.error(`coordinate output for ${radiusDistance} ${distanceType} is in WIP`)
    } 

    return finalCoord
}

module.exports = {
    decToDist,
    kmToMi,
    miToKm,
    boxCoordsFromlatLong,
    isCoordsInBox
}