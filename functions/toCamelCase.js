function toCamelCase(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}

module.exports = {
    toCamelCase
}