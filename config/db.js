import { connect } from "mongoose";
import { config } from "dotenv";
import logger from '../services/logger/logger.js';


config()

export const ConnectDb = () => {
    try {
        connect(process.env.MONGO_URI)
        console.log(`Mongo Db Connected ✅`)
    } catch (e) {
        console.error(`Connecting to DB ERROR: ${e.message}`)
    }
}

