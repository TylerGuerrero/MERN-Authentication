import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'

import UserRoutes from './routes/UserRoutes.js'

dotenv.config()
const app = express()

const options = {
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: true
}

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

mongoose.connect(process.env.DB_URL, options)
        .catch((err) => console.log(err))

mongoose.connection.on('error', () => {
    console.log('Post MongoDB connection error')
})

mongoose.connection.once('open', () => {
    console.log('MongoDB Connected')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})