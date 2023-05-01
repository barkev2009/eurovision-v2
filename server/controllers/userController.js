const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const { User, Rating } = require('../models/models');
const jwt = require('jsonwebtoken');
const { log } = require('../logs/logger');

const generateJWT = (id, name, login, role) => {
    let expiresIn = '24h';
    // if (role === 'ADMIN') {
    //     expiresIn = '1h';
    // }
    return jwt.sign(
        {
            id,
            name,
            login,
            role
        },
        process.env.SECRET_KEY,
        { expiresIn }
    )
}

class UserController {
    async register(req, resp, next) {
        const { name, login, password, role } = req.body;

        if (!name || !login) {
            return next(ApiError.badRequest('Некорректные имя и логин'));
        }
        if (!name) {
            return next(ApiError.badRequest('Некорректное имя'));
        }
        if (!login) {
            return next(ApiError.badRequest('Некорректный логин'));
        }

        const candidate = await User.findOne({ where: { login } });
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ name, login, password: hashPassword, role });
        const token = generateJWT(user.id, user.name, user.login, user.role);

        const ratings = await Rating.findAll(
            {
                include: [
                    {
                        model: User,
                        required: true,
                        where: {role: 'ADMIN'}
                    }
                ]
            }
        );
        
        let rating;
        for (let i = 0; i < ratings.length; i++) {
            rating = ratings[i];
            await Rating.create({ userId: user.id, entryId: rating.entryId});
        }

        log('info', { message: 'REGISTER', token });
        return resp.json({ token })

    }

    async login(req, resp, next) {
        const { login, password } = req.body;
        const candidate = await User.findOne({ where: { login } });

        if (!candidate) {
            return next(ApiError.internalError('Пользователь не найден'))
        }

        let comparePassword = bcrypt.compareSync(password, candidate.password);
        if (!comparePassword) {
            return next(ApiError.internalError('Неверный пароль'))
        }

        const token = generateJWT(candidate.id, candidate.name, candidate.login, candidate.role);
        log('info', { message: 'LOGIN', token });
        return resp.json({ token })
    }

    async checkAuth(req, resp, next) {

        const token = generateJWT(req.user.id, req.user.name, req.user.login, req.user.role);
        log('info', { message: 'CHECK_AUTH', token });
        return resp.json({ token })
    }
}

module.exports = new UserController();