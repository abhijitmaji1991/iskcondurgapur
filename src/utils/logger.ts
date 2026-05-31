import winston from 'winston';

const transports: winston.transport[] = [];

if (process.env.NODE_ENV === 'production') {
  transports.push(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }));
} else {
  transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'logs/combined.log' }));
  transports.push(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports
});

export default logger;
