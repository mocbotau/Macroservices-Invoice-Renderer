import stripAnsi from "strip-ansi";
import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  return process.env.NODE_ENV === "development" ? "debug" : "http";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "white",
  http: "blue",
  debug: "cyan",
};

winston.addColors(colors);

const formatConsole = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const formatLogs = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  // remove ansi colours from morgan
  winston.format.printf((info) => {
    return `${info.timestamp} ${stripAnsi(info.level)}: ${stripAnsi(
      info.message
    )}`;
  }),
  winston.format.errors({ stack: true })
);

// Logs separate files, errors and stack traces only in error.log
const transports = [
  new winston.transports.Console({ format: formatConsole }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: formatLogs,
  }),
  new winston.transports.File({ filename: "logs/all.log", format: formatLogs }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;
