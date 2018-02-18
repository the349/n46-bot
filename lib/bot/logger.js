const winston = require('winston');

module.exports = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(info =>
      `${info.level}\t[${info.timestamp}] ${info.module}: ${info.message}`)
  )
});
