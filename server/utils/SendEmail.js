import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path: './config/config.env'})

export const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        to: options.to, 
        from: options.from,
        subject: options.subject,
        html: options.text
    }

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err)
            console.log("Email does not exist")
        } else {
            console.log("Email was sent")
        }
    })
}