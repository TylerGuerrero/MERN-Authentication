import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const { Schema, model } = mongoose
const { hash, genSalt } = bcryptjs

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        minLength: [6, 'Minimum length is 6 characters'],
        maxLength: [255, 'Maximum characterss is 6 charachters']
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"
        ],
        minLength: [6, 'Minimum characters is 6 characters '],
        maxLength: [255, 'Maximum characters is 6 characters']
    },
    password :{
        type: String,
        required: [true, "Please add a password"],
        select: false,
        minLength: [6, 'Minimum length is 6 characters'],
        maxLength: [255, 'Maximum length is 255 characters']
    },
    resetPasswordToken: {type: String},
    resetPasswordExpire: {type: Date}
}, {timestamps: true})

// we use function to get access to this which refers to the document
// function fires before document gets inserted to the database
userSchema.pre('save', async function(next) {
    try {
        const salt = await genSalt(12)
        this.password = await hash(this.password, salt)
        next()
    } catch (error) {
        console.log(error)
    }
})

// function fires after documnet gets saved to the database
userSchema.post('save', function(doc, next) {
    console.log(doc)
    next()
})  

const user = model('user', userSchema)
export default user