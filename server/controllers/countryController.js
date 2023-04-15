const uuid = require('uuid');
const path = require('path');
const { Country } = require('../models/models');
const ApiError = require('../error/ApiError');
const { log } = require('console');

class CountryController {
    async create(req, res, next) {
        try {
            const { name, code } = req.body;
            const countryCheck = await Country.findAll({where: {code}});
            if (countryCheck.length !== 0) {
                return next(ApiError.badRequest({function: 'CountryController.create', message: 'Страна уже существует'}));
            }

            const { icon } = req.files;
            

            let fileName = uuid.v4() + '.svg';
            icon.mv(path.resolve(__dirname, '..', 'static', fileName));

            const country = await Country.create({name, code, icon: fileName});
            log('info', {message: 'CREATE', country});
            return res.json(country);
        } catch (error) {
            return next(ApiError.internalError({function: 'CountryController.create', message: error.message}))
        }
    }

    async edit(req, res, next) {
        try {
            const { code } = req.params;
            const { name } = req.body;
            const country = await Country.findOne({where: {code}});
            if (!country) {
                return next(ApiError.badRequest({function: 'CountryController.edit', message: 'Страны не существует'}));
            }

            const files = req.files;
            if (files) {
                let fileName = country.icon;
                files.icon.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            const result = await Country.update(
                {name},
                {where: {code}}
            );
            
            const newCountry = await Country.findOne({where: {code}});
            log('info', {message: 'EDIT', result: {country: newCountry, result}});
            return res.json({country: newCountry, result});
        } catch (error) {
            return next(ApiError.internalError({function: 'CountryController.edit', message: error.message}))
        }
    }

    async getAllCountries(req, res, next) {
        try {
            const countries = await Country.findAll();
            return res.json(countries);
        } catch (error) {
            return next(ApiError.internalError({function: 'CountryController.getAllCountries', message: error.message}))
        }
    }

    async getCountryByCode(req, res, next) {
        try {
            const {code} = req.params;
            const country = await Country.findOne({where: {code}});
            return res.json(country);
        } catch (error) {
            return next(ApiError.internalError({function: 'CountryController.getCountryByCode', message: error.message}))
        }
    }

    async getCountryByName(req, res, next) {
        try {
            let {name} = req.params;
            name = name.replace('%20', ' ');
            const country = await Country.findOne({where: {name}});
            return res.json(country);
        } catch (error) {
            return next(ApiError.internalError({function: 'CountryController.getCountryByName', message: error.message}))
        }
    }
}

module.exports = new CountryController();