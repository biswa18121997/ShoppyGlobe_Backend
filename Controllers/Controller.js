import {UserModel} from '../SchemaModels/userSchema.js'
import {ProductModel} from '../SchemaModels/productsSchema.js'
import {CartModel} from '../SchemaModels/cartSchema.js'
import bcrypt from 'bcrypt'


//adding salt for bcrypt..
export const SALT = 8;

//controller for home routes
export function Home(req, res){
     return res.status(201).send(
         `
        <h2>Available API Endpoints</h2>
        <ul>
            <li><strong>GET /products</strong>: Fetch a list of products from MongoDB.</li>
            <li><strong>GET /products/:id</strong>: Fetch details of a single product by its ID.</li>
            <li><strong>POST /cart/:id</strong>: Add a product to the shopping cart.</li>
            <li><strong>PUT /cart/:id</strong>: Update the quantity of a product in the cart.</li>
            <li><strong>DELETE /cart/:id</strong>: Remove a product from the cart.</li>
        </ul>`
     )
}

//controller to register a user..
export async function registerUser(req, res){
    try{
        const {email, username, password } = req.body;
        console.log(req.body);
        // hasing the password given by user
        let hashed = bcrypt.hashSync(password,SALT);
        if(hashed){
            await UserModel.insertOne({email, username, passwordHashed : hashed});   
            return res.status(201).json({message: "User Created Succesfully... Please login to continue.."});
        }
        return res.status(400).json({message : "hashing error..."}) ;   
    }
    catch(err){
        console.log("internal server error " ,err)
    }
}


//controller for loging a user in afteer checking the password
export async function loginUser(req, res){
    const {email, password}=req.body;
    let userDB= await UserModel.findOne({"email": email})
    //if password matches then give a greetings message
    if(bcrypt.compareSync(password,userDB.passwordHashed )){
        res.status(201).json({"message": "Login Succesfull",
                                "Greetings": `WELCOME USER ${userDB.username}`  })
    }else{
        //otherwise..
        res.status(404).json({"message": "Login Failed",
                                "Greetings": `Password you provided doesnot match` })
    }
}

//controller for getting all the productss..
export async function getProducts(req, res){
    try{
        let products=await ProductModel.find();
        res.status(200).json(products);
    }catch(err){
        console.log("internal server error " ,err)
    }
    
}
//contrller for getting a product by id..
export async function getProduct(req, res){
    try{
        let product= await ProductModel.findOne({"id": req.params.id});
        return res.status(200).json(product);
    }catch(err){
        console.log("internal server error " ,err)
    }
}
//controller for adding an item to cart..
export async function postCart(req,res){
    try{
        let findCart = await CartModel.findOne({"userEmail" : req.email});
                //if no cart by that useremail then create one
        if(!findCart || findCart.length == 0){
            await CartModel.insertOne({"userEmail": req.email,
                                        "items": [{"productID":req.params.id }]
            })
        }else{
            // if there is a cart by that useremail then find if the product already there or not in the cart...
            let checkingForExistance=await CartModel.findOne({"userEmail": req.email ,
                                                                "items" : {$elemMatch:{"productID" : req.params.id}} 
                                                            })
// if such product in not there in the cart..simply create a new object with the product id and push it to items array for  this user cart..                           
            if(!checkingForExistance || checkingForExistance.length==0) {
                await CartModel.findOneAndUpdate({"userEmail":req.email },{$push:{items:{"productID" :req.params.id }}})
            }
            //if such product is already theere then increament its quantity by 1..
            else{
                await CartModel.findOneAndUpdate({"userEmail":req.email ,"items.productID": req.params.id  },{$inc: {"items.$.quantity": 1}},{new : true});
            }
        }
        res.status(201).json({message : "added to cart succesfully..."});
    }catch(err){
        console.log("internal server error " ,err)
    }
}
//controller to change the no. of   quantiity ..
export async function putCart(req,res){
    try{
        await CartModel.findOneAndUpdate({"userEmail": req.email,
                                            "items.productID": req.params.id}, {$set:{"items.$.quantity": Number(req.body.quantity )}},{new:true}  )
        res.status(200).json({message: "Product Quantity changed Succesfullt"});
    }catch(err){
        console.log("internal server error " ,err)
    }
}
//controller to delete the item 
export async function deleteCart(req,res){

    try{
        await CartModel.findOneAndUpdate({userEmail: req.email},
                                        { $pull: { items: { productID: Number(req.params.id) } } },
                                    {new : true});
        return res.status(201).json({message :  "Delete succesfull"});
    } 
    catch(err){
        console.log("internal server error " ,err)
    }        
}