const jwt = require('jsonwebtoken');

module.exports = function (req, resp, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer TOKEN
        if (!token) {
            resp.status(401).json(
                {
                    message: 'Не авторизован'
                }
            )
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded
        next()
    } catch (error) {
        resp.status(403).json(
            {
                message: 'Неверный токен'
            }
        )
    }
}