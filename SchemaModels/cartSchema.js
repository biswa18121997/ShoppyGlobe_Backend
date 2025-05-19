import mongoose from 'mongoose'
import {ProductModel} from './productsSchema.js'


const itemSchema= new mongoose.Schema({
    "productID":{
        type : Number,
        required : true
    },
    "quantity":{
        type : Number,
        required : true,
        default : 1
    }
})


const cartSchema =new mongoose.Schema({
    "userEmail" :{
        type: String,
        required: true,
    },
    "items" :[itemSchema]
    
})

export const CartModel = mongoose.model('cart', cartSchema);