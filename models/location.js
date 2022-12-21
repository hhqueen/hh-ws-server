const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
    latitude: {type: Number},
    longitude: {type: Number},
    type: {type: String},
    name: {type: String},
    number: {type: String},
    postal_code: {type: String},
    street: {type: String},
    confidence: {type: Number},
    region: {type: String},
    region_code: {type: String},
    county: {type: String},
    locality: {type: String},
    administrative_area: {type: String},
    neighbourhood: {type: String},
    country: {type: String},
    country_code: {type: String},
    continent: {type: String},
    label: {type: String}
},{
    timestamps: true  
})

module.exports = mongoose.model('Location', LocationSchema)