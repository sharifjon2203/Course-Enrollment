import { connect } from "mongoose";
import { config } from "dotenv";


config()

export const ConnectDb = () => {
    try {
        connect(process.env.MONGO_URI)
        console.log(`Mongo Db Connected ✅`)
    } catch (e) {
        console.log(`Connecting to DB ERROR: ${e.message}`)
    }
}

