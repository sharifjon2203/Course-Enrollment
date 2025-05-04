// import { createLogger, format, level, transports } from "winston";

import pkg from 'winston';
const { createLogger, format, level, transports } = pkg;

import "winston-mongodb"
import { config } from "dotenv";

config()


const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [

        new transports.Console({ format: format.simple() }),
        new transports.File({
            filename: "/logs/error.log",
            level: "error"
        }),


        new transports.File({ filename: "logs/logs.log" }),
        new transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: "logs",
            level: "info"
        })
    ]
})

export default logger;