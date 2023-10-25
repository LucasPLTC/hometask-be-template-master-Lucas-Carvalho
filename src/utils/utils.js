function arrayIsEmpty(array) {
    if (!Array.isArray(array)) {
        return false;
    }
    return array.length === 0;

}

module.exports = {
    arrayIsEmpty
};
