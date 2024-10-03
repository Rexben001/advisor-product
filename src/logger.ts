import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let logMessage = `${timestamp} ${level}: ${message}`;

    if (Object.keys(metadata).length > 0) {
        logMessage += ` ${JSON.stringify(metadata)}`;
    }
    return logMessage;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        logFormat,
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' }),
    ],
});

export default logger;
