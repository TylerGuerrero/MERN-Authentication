import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { Schema, model } = mongoose
const { hash, genSalt, compare } = bcryptjs
const { sign } = jwt

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

// this has access to query object
userSchema.static.login = async function(email, password){
    try {
        const user = await this.findOne({email}).select("+password")
        
        if (!user) {
            throw new Error('User does not exists')
        }

        const isMatch = await compare(password, user.password)

        if (isMatch) {
            return user
        } else {
            throw new Error('Incorrect Password')
        }

    } catch (error) {
        console.log(error.message)
        return error.message
    }
}

// this refers to the document
userSchema.methods.matchPasswords = async function(password) {
    return await compare(password, this.password)
}

userSchema.methods.getSignToken = function() {
    return sign({id: this._id, username: this.username}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

const user = model('user', userSchema)
export default user