import express from 'express'
import { addUser, allUsers, deleteUser, getUser, loginUser, logout, updateUser } from '../Controllers/AuthController.js'
import userCheck from '../Middleware/Authmiddle.js'
import { adminMiddle, userMiddle } from '../Middleware/AdminMiddleware.js'

const authroute = express.Router()

authroute.post('/user',addUser)
authroute.get('/getusers',userMiddle ,adminMiddle ,allUsers)
authroute.get('/user/:id',getUser)
//userCheck is middleware to check token and id match
authroute.put('/user/:id',userMiddle,updateUser)
authroute.delete('/user/:id',deleteUser)
authroute.post('/login',loginUser)
authroute.post('/logout',logout)

//In above all routes the first parameter is end point and the second paramter is controller function that we made in controller folder

export {authroute}