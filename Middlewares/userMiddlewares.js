import {UserModel} from '../SchemaModels/userSchema.js'
import {ProductModel} from '../SchemaModels/productsSchema.js'
import {CartModel} from '../SchemaModels/cartSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import {SALT} from '../Controllers/userController.js'

//To register a user..
export async function registerUserChecker(req, res, next){
    const {email, username, password } = req.body;
    //checking all required feilds..
    if(!email || !username || !password  ){
        return res.status(402).json({message: "Please enter all details correctly..dont leave empty feilds.."})
    }
    let checkUserExists=await UserModel.findOne({"email":email});
    // if already exists the respond with exists messgae
    if(checkUserExists){
        return res.status(402).json({message: "User already exists with this email..."})
    }
    next();
}
//after logging in this middleware runss for creation of tooken and request headers authorization..
export async function authTokenizerChecker(req,res,next){
    const token= jwt.sign({"email":req.body.email}, "ShoppyGlobe",{ expiresIn: '1h' });
    req.headers['authorization']= 'JWT'+` ${token}`;
    console.log("token : --> ",token)
    //res.json({token});
    next();
}
//this runs after every request to make sure only logged in users can access that page..
export async function authVerifyChecker(req, res, next ){
    
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(403).json({message : 'please login to continue..! your token might have expired..'})
    }
    //this is the secret JWT key-->   "ShoppyGlobe"
    jwt.verify(token, "ShoppyGlobe", (err, decoded)=>{
        if(err){
            return res.status(403).json({message : "invalid JWT token please Login again.."})
        }
        req.email = decoded.email ;
        //after each request verification check if user is logged in or not..
        console.log("verification complerte..current useremail : ->",req.email);
        next();
    })
}
//first middleware for log in to check if user exists
export async function loginUserChecker(req, res, next){
    try{
        const {email, password} = req.body;
        //validating inputs..
        if(!email || !password)
                return res.status(400).json({message : "enter details correctly..!"})
        const user = await UserModel.findOne({email: email});
        if(!user || user.length == 0){
            return res.status(400).send("no such user exist plese register and then login ..!")
        }
        // check if passwrod matches
        let verifyingPassword = bcrypt.compareSync(password , user.passwordHashed);

        if(!verifyingPassword)
            return res.status(403).json({message : "Password Incorrect...!"})
        //if match then go to next middleware for generating token and verifying with acess token..
        next();
      
        
    }catch(err){
        console.log("internal server error " ,err);
    }
   
    
}
// a useless middleware..
export async function getProductsChecker(req, res, next){
    next();
}

//middleware to check if the requested product even exists..
export async function getProductChecker(req, res, next){
    try{
        let product = await ProductModel.findOne({"id": req.params.id});
        if(!product || product.length==0){
            return res.status(400).json({message : "no products found by this id"});
        }
      //if product with this id exists then go to next controller..
        next();
    }catch(e){
        console.log("internal server error " ,e)
    }
    
}
//middleware to check if the requested requested product id to be added to cart is even existing in database..
export async function postCartChecker(req, res, next){
    try{
        let product = await ProductModel.findOne({"id": req.params.id});
        if(!product || product.length==0){
            return res.status(403).json({message: `such product with id: ${req.params.id}  exist..! Go for a different product `})
        }
        else{
            //if found go to next controller function..
            next();
            return;
        }  
    }catch(err){
        console.log("internal server error " ,err)
    }
}
//middleware to check if the quantity of a product to be changed even exists in the cart the user
export async function putCartChecker(req, res, next){
    try{
       let checkProductExistance = await CartModel.findOne({userEmail: req.email,
                                                            "items.productID": req.params.id  });
       if(!checkProductExistance){
        res.status(402).json({message : "No such items exists in your cart ..please add This item first.."})
       }
       else{
        //if such product exists in the cart then go to next controller function..
       next();
       }
    }catch(err){
        console.log("internal server error " ,err)
    }
}
//middleware to check if the requseted item for deletion even exists in the cart of th user..
export async function deleteCartChecker(req, res, next){
    try{
        //firstcheck if the user even has a cart..
        let findCart = await CartModel.findOne({"userEmail" : req.email})
        if(!findCart || findCart.length == 0){
            return res.status(403).json({message : "you have no cart ..Add a product to create your own cart"});
        }
        else{
            //if the user has a cart then check the existance of the product in his cart
            let checkCartExistance = await CartModel.find({ userEmail : req.email,
                                                            "items.productID" : req.params.id                                            
                                                        });
            if(!checkCartExistance || checkCartExistance.length==0){
                return res.status(400).json({message : "this product is not added to your cart please add the product first..!"})
            }
            else{
                //if existance found go to next controller funtion..
                next();
            }
        }

    }catch(err){
        console.log("internal server error " ,err)
    }
}
