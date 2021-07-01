import express from 'express'

import * as AuthController from '../controllers/AuthController.js'

const router = express.Router()

router.post('/register', AuthController.register_post)

router.post('/login', AuthController.login_post)

router.post('/forgotpassword', AuthController.forget_password_post)

router.put('/resetpassword/:resetToken', AuthController.reset_password_put)

export default router