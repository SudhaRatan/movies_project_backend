require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: "50mb" }));
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))


// DB setup
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    family: 4,
})
mongoose.set('strictQuery', false)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to mongoose"))

//routes setup
const index = require('./routes/index')
const login = require('./routes/login')

//use routes
app.use('/',index)
app.use('/login',login)

app.listen(process.env.PORT,()=>{
    console.log("Server listening at port 3001")
})