const ApiError = require('../error/ApiError');

module.exports = function (error, req, resp, next) {
    if (error instanceof ApiError) {
        return resp.status(error.status).json({message: error.message})
    }
    return resp.status(500).json({message: error.message})
}