

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
        finalCoord.posLat = ((deciLatitude * milePerDegreeLatitude) + radiusDistance) / milePerDegreeLatitude
        finalCoord.negLat = ((deciLatitude * milePerDegreeLatitude) - radiusDistance) / milePerDegreeLatitude
        finalCoord.posLong = ((deciLongitude * milePerDegreeLatitude) + radiusDistance) / milePerDegreeLatitude
        finalCoord.negLong = ((deciLongitude * milePerDegreeLatitude) - radiusDistance) / milePerDegreeLatitude
    } else if (distanceType = "km") {
        // // find new distance (km) and convert back to deci
        // finalDeciLatitude = deciLatitude * milePerDegreeLatitude *
        // finalDeciLongitude = deciLongitude * milePerDegreeLongitude  *
        console.error(`coordinate output for ${radiusDistance} ${distanceType} is in WIP`)
    } 

    return finalCoord
}

module.exports = {decToDist}