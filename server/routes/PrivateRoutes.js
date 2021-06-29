import express from 'express'

import User from '../models/UserModel.js'
import ErrorResponse from '../utils/ErrorHandler.js'

const { Router } = express

const router = Router()

router.get("/", (req, res) => {
    return res.status(201).json({success: true, user: req.user})
})

export default router