const deepCopyObj = (objToBeCopied) => {
    return JSON.parse(JSON.stringify(objToBeCopied));
}
module.exports = {deepCopyObj}