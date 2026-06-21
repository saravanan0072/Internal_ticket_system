import express from 'express'
import authRoutes from './Routes/authRoutes.js'
import ticketRoutes from './Routes/ticketRoutes.js';
import {createTables} from './config/model/createTables.js'
import cors from 'cors'
import dotenv from 'dotenv'


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/tickets", ticketRoutes);
const serverStart = async()=>{
    try{
        await createTables()
        app.listen(process.env.PORT,()=>{
            console.log(`the server is listen on ${process.env.port}`)
        })
    }
    catch(err){
        console.log("serverErr",err.message)
    }
}
serverStart()