import winston from 'winston';
import expressWinston from 'express-winston'

const info = expressWinston.logger({
    transports: [ new winston.transports.Console() ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
});


const error = expressWinston.errorLogger({
    transports: [ new winston.transports.Console() ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
});

export default {
    info,
    error
}
