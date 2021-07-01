import crypto from 'crypto'

import User from '../models/UserModel.js'
import ErrorResponse from '../utils/ErrorHandler.js'
import { sendEmail } from '../utils/SendEmail.js'

const handleToken = (user, res) => {
    const token = user.getSignToken()
    res.cookie("jwt", token, {httpOnly: true, maxAge: 24*3*60*60})
    return token
}

export const register_post = async (req, res, next) => {
    const { username, email, password } = req.body
    
    try {
        const user = await User.create({username, email, password})
        const token = handleToken(user, res)
        return res.status(201).json({success: true, token})
    } catch (error) {
        next(error)
    }
}

export const login_post = async (req, res, next) => {
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
}

export const forget_password_post = async (req, res, next) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) return next(new ErrorResponse("User not found", 404))

        const resetToken = user.getResetPasswordToken()
        const resetUrl = `http://localhost:5000/resetpassword/${resetToken}`
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password </p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a> 
        `

        try {
            await sendEmail({
                    to: user.email, 
                    from: process.env.EMAIL_FROM, 
                    subject: "Password Reset Request", 
                    text: message
                })

            await user.save()
            return res.status(201).json({success: true, data: "Email Sent"})
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save()
            return next(new ErrorResponse("Email could not be sent", 500))
        }
    } catch (error) {
        return next(new ErrorResponse(error.message, 500))
    }   
}

export const reset_password_put = async (req, res, next) => {
    const { password } = req.body
    const { resetToken } = req.params
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    
    try {
        const user = await User.findOne({ resetPasswordToken,
                                        resetPasswordExpire: { $gt: Date.now() }})
        
        
        if (!user) return next(new ErrorResponse("Invalid reset Token, Reset it", 400))
        
        user.password = password
        user.resetPassowrdToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        return res.status(201).json({success: true, data: "Password was reset"})
    } catch (error) {
        return next(new ErrorResponse(error.message, 500))
    }
}

export const logout_get = (req, res) => {
    res.cookie("jwt", "", {maxAge: 3})
    return res.status(201).json({success: true, data: 'Logged Out'})
}