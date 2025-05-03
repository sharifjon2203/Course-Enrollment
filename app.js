import express from "express"

import userRouter from "./routes/user.routes.js"
import cookieParser from 'cookie-parser';


export const app = express()

app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter)




