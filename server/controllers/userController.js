const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const { User } = require('../models/models');
const jwt = require('jsonwebtoken');
const { log } = require('../logs/logger');

const generateJWT = (id, name, login) => {
    return jwt.sign(
        {
            id,
            name,
            login
        },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class UserController {
    async register(req, resp, next) {
        const { name, login, password } = req.body;

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
        const user = await User.create({ name, login, password: hashPassword });
        const token = generateJWT(user.id, user.name, user.login);

        log('info', {message: 'REGISTER', token});
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

        const token = generateJWT(candidate.id, candidate.name, candidate.login);
        log('info', {message: 'LOGIN', token});
        return resp.json({ token })
    }

    async checkAuth(req, resp, next) {

        const token = generateJWT(req.user.id, req.user.name, req.user.login);
        log('info', {message: 'CHECK_AUTH', token});
        return resp.json({ token })
    }
}

module.exports = new UserController();