function arraysSame () {
    // console.log("arguments:",arguments)
    // init bool and error message
    let response = {
        result: false,
        errorMessage: null
    }

    // check if there are more than 1 arguments
    if (arguments.length < 2) {
        response.errorMessage = "Error, less than 2 arguments passed"
        return response
    }
    console.log("more than 2 arguments")

    // check if arguments are arrays
    const argsEntries = Object.entries(arguments)
    console.log(argsEntries)
    argsEntries.forEach(arr => {
        if (!Array.isArray(arr[1])) {
            response.errorMessage = "Error, argument(s) not type of array"
            return response
        }
    });
    console.log("arguemnts are arrays")

    // init first array
    const array1 = argsEntries[0]

    // check if arrays are all same length
    for(let i = 1; i<argsEntries.length; i++) {
        if (!array1[1].length === argsEntries[i][1].length) {
            response.errorMessage = "Error, array lengths are different"
            return response
        }
    }

    // check if arrays are all the same
    const errorIndexSet = new Set()
    for(let i = 1; i<argsEntries.length; i++) {
        argsEntries[i][1].forEach((item, j)=>{
            if (item !== array1[1][j]) {
                errorIndexSet.add(j)
            }
        })
    }


    // convert set to array for processing
    const errorIndexArr = Array.from(errorIndexSet)

    // checks number of indexes in the error set
    if (errorIndexArr.length > 0) {
        const errorIndexesStr = ""
        errorIndexArr.forEach(errNum , idx => {
            if (idx == 0 ) {
                errorIndexesStr += `${errNum}`
            } else {
                errorIndexesStr += `,${errNum}`
            }
        })
        response.errorMessage = `Error, index(s) ${errorIndexesStr} are not the same`
        return response
    }

    response.result = true
    return response
}

function objectsSame () {

}

module.exports = {
    arraysSame,
    objectsSame
}
