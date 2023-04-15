const ApiError = require('../error/ApiError');
const { log } = require('../logs/logger');
const { Contestant, Country } = require('../models/models');
const { createCountry } = require('../utils/country');

class ContestantController {
    async create(req, res, next) {
        try {
            const { artist_name, song_name, year, qualifier, place_in_final, country_name } = req.body;
            const contestantCheck = await Contestant.findAll({ where: { artist_name, song_name, year } });
            if (contestantCheck.length !== 0) {
                return next(ApiError.badRequest({ function: 'ContestantController.create', message: `Участник уже существует, id=${contestantCheck[0].id}` }));
            }
            if (!artist_name || !song_name || !year || !country_name) {
                return next(ApiError.badRequest({ function: 'ContestantController.create', message: `Не хватает параметра: ${!artist_name ? 'artist_name': ''} ${!song_name ? 'song_name' : ''} ${!year ? 'year': ''} ${!country_name ? 'countryName': ''} ` }));
            }

            let country = await Country.findOne({where: {name: country_name}});
            if (!country) {
                const result = await createCountry(country_name);
                if (result.status === 'fail') {
                    return next(ApiError.internalError({ function: 'ContestantController.create', message: result }))
                }
                country = await Country.findOne({where: {name: country_name}});
            }
            const contestant = await Contestant.create({ artist_name, song_name, year, qualifier, place_in_final, countryId: country.id });
            log('info', {message: 'CREATE', contestant});
            return res.json(contestant);
        } catch (error) {
            return next(ApiError.internalError({ function: 'ContestantController.create', message: error.message }))
        }
    }

    async edit(req, res, next) {
        try {
            const { id } = req.params;
            const { artist_name, song_name, year, qualifier, place_in_final, country_name } = req.body;

            if (!id) {
                return next(ApiError.badRequest({function: 'ContestantController.edit', message: `Не предоставлено id`}));
            }

            const contestant = await Contestant.findOne({where: {id}});
            if (!contestant) {
                return next(ApiError.badRequest({function: 'ContestantController.edit', message: `Участник с id=${id} не найден`}));
            }
            let changes = {
                artist_name, song_name, year, qualifier, place_in_final
            };
            if (country_name) {
                let country = await Country.findOne({where: {name: country_name}});
                if (!country) {
                    const result = await createCountry(country_name);
                    if (result.status === 'fail') {
                        return next(ApiError.internalError({ function: 'ContestantController.edit', message: result }))
                    }
                    country = await Country.findOne({where: {name: country_name}});
                }
                changes = {
                    artist_name, song_name, year, qualifier, place_in_final, countryId: country.id
                };
            }

            const result = await Contestant.update(
                changes
                ,
                {where: {
                    id
                }}
            )
            const newContestant = await Contestant.findOne({where: {id}});
            log('info', {message: 'EDIT', result: {contestant: newContestant, result}});
            return res.json({contestant: newContestant, result});

        } catch (error) {
            return next(ApiError.internalError({function: 'ContestantController.edit', message: error.message}))
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params;
            const contestant = await Contestant.findOne({where: {id}});
            return res.json(contestant);
        } catch (error) {
            return next(ApiError.internalError({function: 'ContestantController.getById', message: error.message}))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            if (id) {
                const contestant = await Contestant.findOne({ where: { id } });

                await Contestant.destroy(
                    {where: {
                        id
                    }}
                );

                log('info', {message: 'DELETE', contestant});
                return res.json(
                    {
                        contestant,
                        result: 1
                    }
                )
            }
            return next(ApiError.internalError('Не вышло удалить участника'));
        } catch (error) {
            return next(ApiError.internalError({ function: 'ContestantController.delete', message: error.message }))
        }
    }
}

module.exports = new ContestantController();