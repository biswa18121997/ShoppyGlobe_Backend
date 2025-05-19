import {registerUserChecker, loginUserChecker,authTokenizerChecker,authVerifyChecker, getProductsChecker, getProductChecker, postCartChecker, putCartChecker, deleteCartChecker } from '../Middlewares/Middleware.js'
import {registerUser, loginUser, getProducts, getProduct, postCart, putCart, deleteCart, Home} from '../Controllers/Controller.js'


export function userRoutes(app){


    app.get('/', Home)

    app.post('/register', registerUserChecker, registerUser );
    app.post('/login', loginUserChecker,authTokenizerChecker,authVerifyChecker, loginUser);

    app.get('/products',authVerifyChecker, getProductsChecker, getProducts);
    app.get('/product/:id',authVerifyChecker ,getProductChecker, getProduct);
    app.post('/cart/:id',authVerifyChecker, postCartChecker, postCart);
    app.put('/cart/:id',authVerifyChecker, putCartChecker, putCart);
    app.delete('/cart/:id', authVerifyChecker, deleteCartChecker, deleteCart);

}

// ○ GET /products: Fetch a list of products from MongoDB.
// ○ GET /products/:id : Fetch details of a single product by its ID.
// ○ POST /cart/:id Add a product to the shopping cart.
// ○ PUT /cart/:id: Update the quantity of a product in the cart.
// ○ DELETE /cart/:id: Remove a product from the cart