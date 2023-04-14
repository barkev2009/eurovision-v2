const { log } = require("../logs/logger");

class ApiError extends Error {
    constructor(status, message) {
        super();

        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        log('error', {status: 404, message: JSON.stringify(message, null, 2)});
        return new ApiError(404, message)
    }

    static internalError(message) {
        log('error', {status: 500, message: JSON.stringify(message, null, 2)});
        return new ApiError(500, message)
    }

    static forbiddenRequest(message) {
        log('error', {status: 403, message: JSON.stringify(message, null, 2)});
        return new ApiError(403, message)
    }
}

module.exports = ApiError;