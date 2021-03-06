import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Routes
import AuthRoutes from './routes/AuthRoutes.js'
import PrivateRoutes from './routes/PrivateRoutes.js'

// Middleware
import { errorHandler } from './middleware/Error.js'
import { authCheck } from './middleware/Auth.js'

dotenv.config({path: "./config/config.env"})
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
app.use(cookieParser())
app.use(cors({credentials: true, origin: true}))

mongoose.connect(process.env.DB_URL, options)
        .catch((err) => console.log(err))

mongoose.connection.on('error', () => {
    console.log('Post MongoDB connection error')
})

mongoose.connection.once('open', () => {
    console.log('MongoDB Connected')
})

app.use('/api/auth', AuthRoutes)
app.use('/api/private', authCheck, PrivateRoutes)

// error handler (should be last be piece of middleware)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error: ${err}`)
    server.close(() => process.exit(1))
})