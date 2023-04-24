const ApiError = require('../error/ApiError');
const { log } = require('../logs/logger');
const { Entry, Contestant } = require('../models/models');

class EntryController {
    async create(req, res, next) {
        try {
            const { entry_order, contest_step, contestantId } = req.body;

            const contestant = await Contestant.findOne({ where: { id: contestantId } });

            if (!contestant) {
                return next(ApiError.internalError({ function: 'EntryController.create', message: `Участника с id=${contestantId} не существует` }));
            }

            const entryCheck = await Entry.findAll({ where: { entry_order, contest_step, contestantId: contestant.id } });
            if (entryCheck.length !== 0) {
                return next(ApiError.internalError({ function: 'EntryController.create', message: `Выступление с id=${entryCheck[0].id} уже существует` }));
            }

            const entry = await Entry.create({ entry_order, contest_step, contestantId: contestant.id });

            log('info', { message: 'CREATE', entry });
            return res.json(entry);
        } catch (error) {
            return next(ApiError.internalError({ function: 'EntryController.create', message: error.message }));
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const entry = await Entry.findOne({ where: { id } });
            return res.json(entry);
        } catch (error) {
            return next(ApiError.internalError({ function: 'EntryController.getById', message: error.message }))
        }
    }

    async getByContestant(req, res, next) {
        try {
            const { id } = req.params;
            const entry = await Entry.findAll({ where: { contestantId: id } });
            return res.json(entry);
        } catch (error) {
            return next(ApiError.internalError({ function: 'EntryController.getByContestant', message: error.message }))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            if (id) {
                const entry = await Entry.findOne({ where: { id } });

                await Entry.destroy(
                    {
                        where: {
                            id
                        }
                    }
                );

                log('info', { message: 'DELETE', entry });
                return res.json(
                    {
                        entry,
                        result: 1
                    }
                )
            }
            return next(ApiError.internalError('Не вышло удалить выступление'));
        } catch (error) {
            return next(ApiError.internalError({ function: 'EntryController.delete', message: error.message }))
        }
    }
}

module.exports = new EntryController();