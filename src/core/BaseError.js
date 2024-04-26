const HttpStatusCode = require( '../core/HttpEnums');
class BaseError extends Error {
    constructor(name, httpCode, description, isOperational) {
        super(description);
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

class APIError extends BaseError {
    constructor(name, description = 'internal server error') {
        super(name, HttpStatusCode.INTERNAL_SERVER, description, true);
    }
}

class HTTP400Error extends BaseError {
    constructor(description) {
        super('BAD REQUEST', HttpStatusCode.BAD_REQUEST, description,true);
    }
}

class HTTP404Error extends BaseError {
    constructor(description) {
        super('NOT_FOUND', HttpStatusCode.NOT_FOUND, description,true);
    }
}

class HTTP401Error extends BaseError {
    constructor(description) {
        super('UNAUTHORIZED', HttpStatusCode.UNAUTHORIZED, description,true);
    }
}

class HTTP500Error extends BaseError {
    constructor(description) {
        super('INTERNAL_SERVER', HttpStatusCode.INTERNAL_SERVER, description,false);
    }
}

module.exports = {BaseError, APIError, HTTP400Error, HTTP401Error, HTTP500Error, HTTP404Error}


