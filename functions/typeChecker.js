
const isNumber = (val) =>{
    const valType = typeof val
    if (valType == 'number') return true
    return false
}

const isString = (val) =>{
    const valType = typeof val
    if (valType == 'string') return true
    return false
}

const isObject = (val) =>{
    const valType = typeof val
    if(valType == 'object' && val !== null) return true
    return false 
}


module.exports = {
    isNumber,
    isObject
}