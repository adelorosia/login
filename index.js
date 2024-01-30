import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { dbConnect } from "./config/dbConnect.js"
import userRouter from "./routes/userRouter.js"
import { errorHandler } from "./middlewares/errorHandler.js"

dotenv.config()
dbConnect()

const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true,origin:"https://front.orosia.online"}))
app.use(userRouter)

app.use(errorHandler)

const port=process.env.PORT || 3005

app.listen(port,console.log(`Server is running on Port: ${port}`))