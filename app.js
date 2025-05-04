import express from "express"
import cookieParser from 'cookie-parser';
import pkg from 'winston';
const { log } = pkg;

import logger from './services/logger/logger.js';
import userRouter from "./routes/user.routes.js"



export const app = express()

app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter)



process.on('uncaughtException', (e) => {
    if (e) {
        console.log(`Error: ${e}`);
        process.exit(1);
    }
});

process.on('unhandledRejection', (reasion, promise) => {
    console.log(`Error: ${reasion}`);
});

app.use((err, req, res, next) => {
    if (err) {
        return res.status(500).json({
            error: err.message || 'Internal server error',
        });
    }
});

logger.info("Server started")




