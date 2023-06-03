import express from 'express';
import connectDatabase from './config/db.js';
import dotenv from 'dotenv';
import errorMiddleware from './middleware/error.js';
import Product from './routes/productRoute.js';
import User from './routes/userRoute.js';
import Order from './routes/orderRoute.js';
import cookieParser from 'cookie-parser';


process.on("uncaughtException", (err)=>{
    console.log(`Error:${err.message}`)
    console.log("uncaughtException");    
       process.exit(1);   
});
const app = express();
app.use(express.json());
app.use(cookieParser());


//config
dotenv.config({path:"backend/config/.env"});

//database calling
connectDatabase();



//route

app.use('/api/v1', Product); 
app.use('/api/v1', User);
app.use('/api/v1',Order)
app.use(errorMiddleware);
const PORT = 8080;

const server  = app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err)=>{
 console.log(`Error:${err.message}`)
 console.log("unhandledRejection");
 server.close(()=>{
    process.exit(1)
 })
})