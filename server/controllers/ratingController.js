const ApiError = require('../error/ApiError');
const { log } = require('../logs/logger');
const { Rating, Contestant, Entry, Country } = require('../models/models');

class RatingController {
    async create(req, res, next) {
        try {
            const { userId, entryId, purity, show, difficulty, originality, sympathy } = req.body;

            const ratingCheck = await Rating.findOne({ where: { userId, entryId } });
            if (ratingCheck) {
                return next(ApiError.internalError({ function: 'RatingController.create', message: `Рейтинг уже существует` }));
            }

            const score = purity + show + difficulty + originality + sympathy;
            const rating = await Rating.create({ userId, entryId, purity, show, difficulty, originality, sympathy, score });

            log('info', { message: 'CREATE', rating });
            return res.json(rating);
        } catch (error) {
            return next(ApiError.internalError({ function: 'RatingController.create', message: error.message }));
        }
    }

    async edit(req, res, next) {
        try {
            const { id } = req.params;
            const { purity, show, difficulty, originality, sympathy } = req.body;

            const rating = await Rating.findOne({ where: { id } });
            if (!rating) {
                return next(ApiError.internalError({ function: 'RatingController.edit', message: `Рейтинга не существует` }));
            }

            let calcPurity;
            let calcShow;
            let calcDifficulty;
            let calcOriginality;
            let calcSympathy;

            purity === null || purity === undefined ? calcPurity = rating.purity : calcPurity = purity;
            show === null || show === undefined ? calcShow = rating.show : calcShow = show;
            difficulty === null || difficulty === undefined ? calcDifficulty = rating.difficulty : calcDifficulty = difficulty;
            originality === null || originality === undefined ? calcOriginality = rating.originality : calcOriginality = originality;
            sympathy === null || sympathy === undefined ? calcSympathy = rating.sympathy : calcSympathy = sympathy;

            console.log(calcPurity);

            const score = calcPurity + calcShow + calcDifficulty + calcOriginality + calcSympathy;

            const result = await Rating.update(
                { purity: calcPurity, show: calcShow, difficulty: calcDifficulty, originality: calcOriginality, sympathy: calcSympathy, score },
                { where: { id } }
            );

            const newRating = await Rating.findOne({ where: { id } });
            log('info', { message: 'EDIT', result: { rating: newRating, result } });
            return res.json({ rating: newRating, result });
        } catch (error) {
            return next(ApiError.internalError({ function: 'RatingController.edit', message: error.message }));
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const rating = await Rating.findOne({ where: { id } });
            return res.json(rating);
        } catch (error) {
            return next(ApiError.internalError({ function: 'RatingController.getById', message: error.message }))
        }
    }

    async getByUser(req, res, next) {
        try {
            const { id } = req.params;
            const rating = await Rating.findAll({ where: { userId: id } });
            return res.json(rating);
        } catch (error) {
            return next(ApiError.internalError({ function: 'RatingController.getByUser', message: error.message }))
        }
    }

    async getByUserEntry(req, res, next) {
        try {
            const { userId, entryId } = req.query;
            const rating = await Rating.findOne({ where: { userId, entryId } });
            return res.json(rating);
        } catch (error) {
            return next(ApiError.internalError({ function: 'RatingController.getByUserEntry', message: error.message }))
        }
    }

    async getByUserContest(req, res, next) {
        try {
            const { userId, year, contest_step } = req.query;

            const result = await Rating.findAll(
                {
                    where: { userId },
                    include: [
                        {
                            model: Entry,
                            where: { contest_step },
                            required: true,
                            include: [
                                {
                                    model: Contestant,
                                    where: { year },
                                    required: true,
                                    include: [
                                        {
                                            model: Country
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    order: [[Entry, 'entry_order', 'ASC']]
                }
            );

            return res.json(result);
        } catch (error) {
            return next(ApiError.internalError({ function: 'RatingController.getByUserContest', message: error.message }))
        }
    }
}

module.exports = new RatingController();