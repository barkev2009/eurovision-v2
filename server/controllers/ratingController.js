const ApiError = require('../error/ApiError');
const { log } = require('../logs/logger');
const { Rating, Contestant, Entry, Country } = require('../models/models');
const jwt = require('jsonwebtoken');
const sequelize = require('./../db');
const { QueryTypes } = require('sequelize');

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
            const { year, contest_step } = req.query;
            const user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
            if (!user) {
                return next(ApiError.internalError({ function: 'RatingController.search', message: 'Пользователь не найден' }))
            }
            const userId = user.id;

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

    async search(req, res, next) {
        try {
            const { q } = req.query;
            const user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
            if (!user) {
                return next(ApiError.internalError({ function: 'RatingController.search', message: 'Пользователь не найден' }))
            }
            const userId = user.id;

            const result = await sequelize.query(
                `
                select 
                    r.id ratingId,
                    r."userId" ,
                    c.id contestantId,
                    c.artist_name ,
                    c.song_name ,
                    c."year" ,
                    c.qualifier ,
                    c.place_in_final ,
                    c2."name" ,
                    c2.icon ,
                    e.contest_step ,
                    e.entry_order ,
                    r.purity,
                    r."show" ,
                    r.difficulty ,
                    r.originality ,
                    r.sympathy ,
                    r.score 
                from ratings r
                join entries e on r."entryId" = e.id 
                join contestants c on e."contestantId" = c.id 
                join countries c2 on c."countryId" = c2.id 
                where r."userId" = '${userId}'
                and (
                    lower(c2."name") like '%${q.toLowerCase()}%'
                    or lower(c.artist_name) like '%${q.toLowerCase()}%'
                    or lower(c.song_name) like '%${q.toLowerCase()}%'
                    or lower(c."year"::text) like '%${q.toLowerCase()}%'
                    or lower(e.contest_step::text) like '%${q.toLowerCase()}%'
                )
                order by c."year" desc, c2."name", c.song_name, c.artist_name, e.contest_step desc
                limit 20
            `,
                { type: QueryTypes.SELECT });

            return res.json(result);
        } catch (error) {
            return next(ApiError.internalError({ function: 'RatingController.search', message: error.message }))
        }
    }
}

module.exports = new RatingController();