import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()
const app = express()
const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log('Server is running');
    
})