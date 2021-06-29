import jwt from 'jsonwebtoken'

import User from '../models/UserModel.js'
import ErrorResponse from '../utils/ErrorHandler.js'

const { verify } = jwt

export const authCheck = async (req, res, next) => {
    const token = req.cookies.jwt

    if (!token) return next(new ErrorResponse("JWT token does not exist", 401))

    try {
        const decodedToken = verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken.id)

        if (!user) return next(new ErrorResponse("User does not exists", 401))
       
        req.user = user
        next()
    } catch (error) {
        return next(new ErrorResponse("You are not authorized to this route", 401))
    }
}