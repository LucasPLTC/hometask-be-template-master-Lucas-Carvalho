const { logger } = require('./Logger'); // Import or define the logger appropriately
const { BaseError, APIError} = require('./BaseError');

class ErrorHandler {
    async handleError(err) {
        if (!err.httpCode){
            throw new APIError("INTERNAL_SERVER_ERROR");
        }
        await logger.error(
            'Error message from the centralized error-handling component',
            err
        );
    }

    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}

module.exports = ErrorHandler;

