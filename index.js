const express = require('express')
const cors = require("cors")
const bodyParser = require('body-parser')

const app = express()
const PORT = 5000

const routes = require('./Src/Routes/routes')


const mongoose = require('mongoose');

// const MONGO_URL = "mongodb://localhost:27017/Notes-App"

const {MONGO_URL} = require("./Src/Auth/Auth")
// console.log(MONGO_URL)

app.use(cors({
    origin: '*'
}))

mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(()=>{
    console.log("Data base connection successful..")
    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}...`)
    })
}).catch((err)=>{
    console.log("Connection error in connecting database...", err)
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.status(200).json("Home page")
    // res.download("./index.js")
})

app.use('/api', routes)


