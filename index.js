const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRouter = require('./routes/auth')
const jobRoutes = require('./routes/job')
const cors = require('cors')

dotenv.config();

const app = express();
app.use(express.json())

app.use(cors())

// connect to database

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("db connected succesfully")
}).catch((err)=>{
    console.log("their has been error connecting to db:", err)
})

// health api
app.get("/health",(req,res)=>{
    res.json({
        service:"job listing server",
        status:"Active",
        time: new Date()
    })
})

app.use('/',authRouter)
app.use('/jobs',jobRoutes)

const PORT = process.env.PORT ||3000
app.listen(PORT,()=>{
    console.log(`the app is running on ${PORT}`)
})