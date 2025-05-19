import mongoose from 'mongoose'


const userSchema =new mongoose.Schema({
    "email":{
        type: String,
        required : true
    },
    "username":{
        type: String,
        required : true
    },
    "passwordHashed":{
        type: String,
        required : true
    },
    "created":{
        type: Date,
        required : true,
        default : new Date(Date.now())
    }
})

export const UserModel = mongoose.model("Users",userSchema);