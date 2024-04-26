const {HTTP404Error, HTTP400Error} = require("../core/BaseError");

function arrayIsEmpty(array) {
    if (!Array.isArray(array)) {
        return false;
    }
    return array.length === 0;

}
function isValidDateParameter(dateString) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(dateString)) {
        return false;
    }

    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime());


}

function validateResult(result) {
    if (result === null || (Array.isArray(result) && result.length === 0)) {
        throw new HTTP404Error("Result is null or empty.");
    }
    return result;
}

function validateParam(param) {
    if (param === null ) {
        throw new HTTP400Error("Parameter missing");
    }

    // if (!Number.isInteger(param)) {
    //     throw new HTTP400Error("Parameter must be an integer");
    // }
    return param;
}

function isValidDateRange(startDate, endDate) {

    const currentDate = new Date();

    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);

    if (startDateObject >= endDateObject) {
        return false;
    }

    if (startDateObject >= currentDate || endDateObject >= currentDate) {
        return false;
    }
    return true;
}


module.exports = {
    arrayIsEmpty,
    isValidDateParameter,
    isValidDateRange,
    validateParam,
    validateResult
};
