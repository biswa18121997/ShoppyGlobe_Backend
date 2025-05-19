import express from 'express';
import mongoose from 'mongoose';
import {Connect} from './Utils/Connect.js'
import {userRoutes} from './Routes/Routes.js'

//instance of express application
const app = express();
app.use(express.json());
app.use((req,res,next)=>{
    console.log("root middleware triggered");
    next();
})
Connect();

userRoutes(app);
const PORT=8086;
app.listen(PORT,()=>{
    console.log("server is live at PORT: ",PORT);
})