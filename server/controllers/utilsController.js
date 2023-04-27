const ApiError = require('../error/ApiError');
const { log } = require('../logs/logger');
const { QueryTypes } = require('sequelize');
const sequelize = require('./../db');

class UtilsController {
    async getYears(req, res, next) {
        try {
            const years = await sequelize.query(`select distinct c.year from contestants c order by c."year" desc `, { type: QueryTypes.SELECT });
            return res.json(years);
        } catch (error) {
            return next(ApiError.internalError({ function: 'UtilsController.getYears', message: error.message }))
        }
    }

    async getContestSteps(req, res, next) {
        try {
            const steps = await sequelize.query(`select distinct c.contest_step from entries c order by c.contest_step`, { type: QueryTypes.SELECT });
            return res.json(steps);
        } catch (error) {
            return next(ApiError.internalError({ function: 'UtilsController.getContestSteps', message: error.message }))
        }
    }
}

module.exports = new UtilsController();