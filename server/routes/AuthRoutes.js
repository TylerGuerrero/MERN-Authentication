import express from 'express'

import * as AuthController from '../controllers/AuthController.js'
import { authCheck } from '../middleware/Auth.js'

const router = express.Router()

router.post('/register', AuthController.register_post)

router.post('/login', AuthController.login_post)

router.post('/forgotpassword', authCehck, AuthController.forget_password_post)

router.put('/resetpassword/:resetToken', authCheck, AuthController.reset_password_put)

router.get('/logout', authCHeck, AuthController.logout_get)

export default router