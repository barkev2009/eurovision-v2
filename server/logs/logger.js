const log4js = require('log4js');

log4js.configure(
    {
        appenders: {
            server: {
                type: 'dateFile',
                filename: 'logs/server.log'
            },
            con: {
                type: 'console'
            }
        },
        categories: {
            default: {
                appenders: ['server', 'con'],
                level: 'all'
            }
        }
    }
)


const logger = log4js.getLogger('server');

const log = async (level, payload) => {
    try {
        const logMessage = payload

        switch (level) {
            case 'error':
                logger.error(JSON.stringify(logMessage, null, 2));
                break;
            case 'info':
                logger.info(JSON.stringify(logMessage, null, 2))
                break;
            case 'fatal':
                logger.fatal(JSON.stringify(logMessage, null, 2))
                break;
            case 'warn':
                logger.warn(JSON.stringify(logMessage, null, 2))
                break;
            case 'debug':
                logger.debug(JSON.stringify(logMessage, null, 2))
                break;
            case 'trace':
                logger.trace(JSON.stringify(logMessage, null, 2))
                break;
            default:
                logger.info(JSON.stringify(logMessage, null, 2))
                break;
        }
    } catch (error) {
        logger.fatal(JSON.stringify(error, null, 2))
    }

}

module.exports = { log };