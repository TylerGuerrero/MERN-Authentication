import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/UserModel.js'

const router = express.Router();
const { sign } = jwt

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body

    try {
        const user = await User.create({username, email, password})
        const payload = {id: user._id, email: user.email}
        const token = sign(payload, process.env.SECRET, {expiresIn: "1hr"})
        res.cookie("jwt", token, {httpOnly: true, maxAge: 60*60})
        return res.status(201).json({success: true, user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, error: error.message})
    }
})

router.post('/login', (req, res) => {
    res.send('hi')
})

router.post('/forgotpassword', (req, res) => {
    res.send('hi')
})

router.put('/resetpassword/:resetToken', (req, res) => {
    res.send('hi')
})

export default router