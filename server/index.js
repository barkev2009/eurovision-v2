const path = require('path');
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: path.resolve(__dirname, '.env.development') });
} else {
    require('dotenv').config({ path: path.resolve(__dirname, '.env.production') });
}


const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const router = require('./routers/index');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/ErrorHandlerMiddleware');
const { Server } = require('socket.io');
const http = require('http');
const https = require('https');
const fs = require('fs');

const options = {
    // key: fs.readFileSync('/etc/ssl/private/nginx-selfsigned.key'),
    // cert: fs.readFileSync('/etc/ssl/certs/nginx-selfsigned.crt')
    key: fs.readFileSync('/etc/letsencrypt/live/barkev2009-portfolio.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/barkev2009-portfolio.ru/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/barkev2009-portfolio.ru/chain.pem')
};

console.log(process.env.NODE_ENV);
const PORT = process.env.PORT || 5002;

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// Middleware с ошибками должен регистрироваться в последнюю очередь!!!
app.use(errorHandler);

app.get(
    '/',
    (req, resp) => {
        resp.status(200).json(
            {
                message: 'Eurovision here!!!'
            }
        );
    }
)

let server;
if (process.env.NODE_ENV === 'development') {
    server = http.createServer(app);
} else {
    server = https.createServer(options, app);
}

const io = new Server(
    server,
    {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        },
        transports: ['websocket', 'polling']
    },
)

io.on(
    'connection', (socket) => {
        socket.on(
            'sendEditQualifier', data => {
                socket.broadcast.emit(
                    'receiveEditQualifier', data
                )
            }
        );

        socket.on(
            'sendEditPlace', data => {
                socket.broadcast.emit(
                    'receiveEditPlace', data
                )
            }
        );


    }
)

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (err) {
        console.error(err)
    }
}

start();