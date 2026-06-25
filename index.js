import dns from 'dns'
dns.setServers(['8.8.8.8','1.1.1.1'])
import express from 'express'
import dotenv from 'dotenv'
import connectDB from "./src/Config/db.js"
import { authroute } from './src/Routes/AuthRoutes.js'
import Users from './src/Models/UserSchema.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import blogroute from './src/Routes/BlogRoutes.js'

const app = express()

//As we have use env variable in our db.js file thats y we use this
dotenv.config()
 
//Function call to coonect data base
connectDB()

//Cors to allow cross origin to communicte forntend and backend
//now its allow all origin means kisi bhi path sy chaly ga
app.use(cors({
  origin: ['https://blog-app-frontend-two-zeta.vercel.app','http://localhost:5173','https://blog-app-frontend-two-zeta.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','Cookie']
}));

//Middleware to parse data
app.use(express.json())

//Middleware to store token in cookies
app.use(cookieParser())
//console.log(cookieParser);

//Initial get request to check if server is working or not
app.get('/',(req,res)=>{
    res.json({
        message : 'Server is running successfully'
    })
})

//Base url / route
app.use('/api/v1/auth' , authroute)
app.use('/api/v1/blog' , blogroute)

//Creating server
app.listen(process.env.PORT , ()=>{
    console.log('Server is running successfully at' , process.env.PORT);
})