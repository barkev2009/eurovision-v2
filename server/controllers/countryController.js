const uuid = require('uuid');
const path = require('path');
const { Country } = require('../models/models');
const ApiError = require('../error/ApiError');

class CountryController {
    async create(req, res, next) {
        try {
            const { name, code } = req.body;
            const countryCheck = await Country.findAll({where: {code}});
            console.log(countryCheck);
            if (countryCheck.length !== 0) {
                next(ApiError.badRequest({function: 'CountryController.create', message: 'Страна уже существует'}));
            }

            const {icon } = req.files;

            let fileName = uuid.v4() + '.svg';
            icon.mv(path.resolve(__dirname, '..', 'static', fileName));

            const country = await Country.create({name, code, icon: fileName});
            return res.json(country);
        } catch (error) {
            next(ApiError.internalError({function: 'CountryController.create', message: error.message}))
        }
    }

    async getAllCountries(req, res, next) {
        try {
            const countries = await Country.findAll();
            return res.json(countries);
        } catch (error) {
            next(ApiError.internalError({function: 'CountryController.getAllCountries', message: error.message}))
        }
    }

    async getCountryByCode(req, res, next) {
        try {
            const {code} = req.params;
            const country = await Country.findOne({where: {code}});
            return res.json(country);
        } catch (error) {
            next(ApiError.internalError({function: 'CountryController.getCountryByCode', message: error.message}))
        }
    }

    async getCountryByName(req, res, next) {
        try {
            let {name} = req.params;
            name = name.replace('%20', ' ');
            const country = await Country.findOne({where: {name}});
            return res.json(country);
        } catch (error) {
            next(ApiError.internalError({function: 'CountryController.getCountryByName', message: error.message}))
        }
    }
}

module.exports = new CountryController();