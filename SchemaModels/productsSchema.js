import mongoose from 'mongoose'


const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default : 4.5
  },
  comment: {
    type: String,
    required: true,
    default: 'Highly recommend!'
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date(Date.now())
  },
  reviewerName: {
    type: String,
    required: true,
    default: 'Jon Snow'
  },
  reviewerEmail: {
    type: String,
    required: true,
    default: 'abc@gmail.com',
  }
});




const productSchema = new mongoose.Schema(
     {
      "id":{
        type:Number,
        required : true,
        default : Math.floor(Math.random() *20)
      } ,
      "title": {
        type: String,
        required : true,
      },
      "description": {
        type: String,
        required : true,
      },
      "category": {
        type: String,
        required : true,
      },
      "price": {
        type: Number,
        required : true,
        default : Math.random()*200
      },
      "discountPercentage": {
        type: Number,
        required : true,
        default : 15
      },
      "rating": {
        type: Number,
        required : true,
        default : 4.5
      },
      "stock": {
        type: Number,
        default : 9,
      },
      "tags": {
        type : [String],
      },
      "brand": {
        type: String,
        required : true,
        default : "HUL"
      },
      
      "weight": {
        type: Number,
        required : true,
        default : 15
      },
      "dimensions": {
        "width":{
        type: Number,
        required : true,
        default : 5
      },
        "height": {
        type: Number,
        required : true,
        default : 5
      },
        "depth": {
        type: Number,
        required : true,
        default : 5
      },
      },
      "warrantyInformation": {
        type: String,
        required : true,
        default : "1 Year Warranty"
      },
      "shippingInformation":{
        type: String,
        required : true,
        default : "Ships in 3-5 business days"
      } ,
      "availabilityStatus": {
        type: String,
        required : true,
        default: "In Stock" 
      } ,
      "reviews":{
        type: [reviewSchema],
      },
      "returnPolicy": {
        type: String,
        required : true,
        default : "No return Policy"
      },
      "minimumOrderQuantity": {
        type: Number,
        required : true,
        default : 20
      },
      "images":{
        type: String,
        required : true,
        default : "https://www.google.com/search?q=dummy+images+of+things+ecommerce&sca_esv=a980cca8ef080035&udm=2&biw=1536&bih=742&sxsrf=AHTn8zo-lMdXfygTxkftzm0pMRvyKtPiiw%3A1747293122976&ei=wpMlaMK1O6OW4-EP4pvwqAs&ved=0ahUKEwjCnqeP9qSNAxUjyzgGHeINHLUQ4dUDCBE&uact=5&oq=dummy+images+of+things+ecommerce&gs_lp=EgNpbWciIGR1bW15IGltYWdlcyBvZiB0aGluZ3MgZWNvbW1lcmNlSIYTUH1Y4hFwAXgAkAEAmAHbAaABjQ6qAQUwLjcuM7gBA8gBAPgBAZgCAKACAJgDAIgGAZIHAKAHwgOyBwC4BwA&sclient=img#vhid=7BNdtVtxAx_oyM&vssid=mosaic"
      }
    
    })

    export const ProductModel = mongoose.model('Products',productSchema);