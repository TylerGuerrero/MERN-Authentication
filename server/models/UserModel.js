import mongoose from 'mongoose'
const { Schema, model } = mongoose

const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
}, {createdAt: true})

const user = model('user', userSchema)
export default user