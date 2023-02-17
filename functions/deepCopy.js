const deepCopyObj = (objToBeCopied) => {
    return JSON.parse(JSON.stringify(objToBeCopied));
}

// wip, i think deep copy obj will work for arrays too
const deepCopyArry = (arrToBeCopies) => {

}
module.exports = {deepCopyObj}