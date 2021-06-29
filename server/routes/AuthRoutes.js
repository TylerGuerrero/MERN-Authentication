import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/UserModel.js'
import ErrorResponse from '../utils/ErrorHandler.js'

const router = express.Router();

const handleToken = (user, res) => {
    const token = user.getSignToken()
    res.cookie("jwt", token, {httpOnly: true, maxAge: 60*60})
    return token
}

router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body
    
    try {
        const user = await User.create({username, email, password})
        const token = handleToken(user, res)
        return res.status(201).json({success: true, token})
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorResponse("Please enter an email and password", 400))
    }

    try {
        const user = await User.findOne({email}).select("+password")
        
        if (!user) return next(new ErrorResponse("User not found", 401))

        const isMatch = await user.matchPasswords(password)

        if (isMatch) {
            const token = handleToken(user, res)
            return res.status(201).json({success: true, token})
        } else {
            return next(new ErrorResponse("Invalid Password", 401))
        }
    } catch (error) {
        next(error)
    }
})

router.post('/forgotpassword', (req, res) => {
    res.send('hi')
})

router.put('/resetpassword/:resetToken', (req, res) => {
    res.send('hi')
})

export default router