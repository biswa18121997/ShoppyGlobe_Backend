# ShoppyGlobe Backend

A Node.js backend for an e-commerce platform, providing user authentication, product browsing, and cart management APIs. Built with Express, MongoDB, JWT, and bcrypt.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [API Routes](#api-routes)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Get All Products](#get-all-products)
  - [Get Product by ID](#get-product-by-id)
  - [Cart Operations](#cart-operations)
- [Middleware & Safety Checks](#middleware--safety-checks)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Sample Requests](#sample-requests)

---

## Project Structure

```
ShoppyGlobe_Backend/
│
├── Controllers/
│   └── userController.js
├── Middlewares/
│   └── userMiddlewares.js
├── SchemaModels/
│   ├── userSchema.js
│   ├── productsSchema.js
│   └── cartSchema.js
├── package.json
└── ...
```

---

## Environment Setup

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd ShoppyGlobe_Backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up MongoDB:**
   - Ensure MongoDB is running locally or update your connection string in your config.

4. **Start the server:**
   ```sh
   npm start
   ```

---

## API Routes

### 1. User Registration

- **Endpoint:** `POST /register`
- **Description:** Registers a new user.
- **Input (JSON):**
  ```json
  {
    "email": "user@example.com",
    "username": "user123",
    "password": "yourPassword"
  }
  ```
- **Safety Checks:**
  - All fields must be present and non-empty.
  - Email must not already exist in the database.
- **Responses:**
  - `201 Created` – User registered successfully.
  - `402` – Missing fields or user already exists.
  - `400` – Hashing error.

---

### 2. User Login

- **Endpoint:** `POST /login`
- **Description:** Authenticates a user and returns a JWT token.
- **Input (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword"
  }
  ```
- **Safety Checks:**
  - Both fields must be present.
  - Email must exist in the database.
  - Password must match the hashed password.
- **Responses:**
  - `201 Created` – Login successful, returns a JWT token.
  - `400` – Missing fields or user does not exist.
  - `403` – Incorrect password.

---

### 3. Get All Products

- **Endpoint:** `GET /products`
- **Description:** Returns a list of all products.
- **Headers:**
  - `Authorization: JWT <token>`
- **Safety Checks:**
  - Only accessible to authenticated users (valid JWT required).
- **Responses:**
  - `200 OK` – Returns product list.
  - `403` – Missing or invalid token.

---

### 4. Get Product by ID

- **Endpoint:** `GET /products/:id`
- **Description:** Returns a single product by its ID.
- **Headers:**
  - `Authorization: JWT <token>`
- **Safety Checks:**
  - Product with the given ID must exist.
- **Responses:**
  - `200 OK` – Returns product.
  - `400` – Product not found.
  - `403` – Missing or invalid token.

---

### 5. Cart Operations

#### a. Add Product to Cart

- **Endpoint:** `POST /cart/:id`
- **Description:** Adds a product to the user's cart.
- **Headers:**
  - `Authorization: JWT <token>`
- **Safety Checks:**
  - Product must exist.
  - Product must not already be in the cart (otherwise, quantity is incremented).
- **Responses:**
  - `201 Created` – Added to cart.
  - `403` – Product does not exist or invalid token.

#### b. Update Product Quantity in Cart

- **Endpoint:** `PUT /cart/:id`
- **Description:** Updates the quantity of a product in the cart.
- **Headers:**
  - `Authorization: JWT <token>`
- **Input (JSON):**
  ```json
  {
    "quantity": 2
  }
  ```
- **Safety Checks:**
  - Product must exist in the user's cart.
- **Responses:**
  - `200 OK` – Quantity updated.
  - `402` – Product not in cart.

#### c. Delete Product from Cart

- **Endpoint:** `DELETE /cart/:id`
- **Description:** Removes a product from the user's cart.
- **Headers:**
  - `Authorization: JWT <token>`
- **Safety Checks:**
  - User must have a cart.
  - Product must exist in the cart.
- **Responses:**
  - `201 Created` – Product deleted.
  - `403` – No cart found.
  - `400` – Product not in cart.

---

## Middleware & Safety Checks

- **registerUserChecker:** Validates registration input and checks for duplicate emails.
- **loginUserChecker:** Validates login input and checks user existence and password.
- **authVerifyChecker:** Validates JWT token for protected routes.
- **getProductChecker:** Checks if a product exists by ID.
- **postCartChecker:** Checks if product exists before adding to cart.
- **putCartChecker:** Checks if product exists in user's cart before updating quantity.
- **deleteCartChecker:** Checks if user has a cart and if the product exists in it before deletion.

---

## Error Handling

- All endpoints return meaningful error messages and HTTP status codes.
- Internal server errors are logged to the console.
- Middleware ensures invalid or unauthorized requests are blocked before reaching controllers.

---

## Security Considerations

- **Passwords** are hashed using bcrypt before storage.
- **JWT tokens** are used for authentication and must be included in the `Authorization` header for protected routes.
- **Sensitive operations** (cart, products) are only accessible to authenticated users.
- **Input validation** is performed on all user-provided data.

---

## Sample Requests

### Register User

```sh
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user123","password":"yourPassword"}'
```

### Login

```sh
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourPassword"}'
```

### Get Products (Authenticated)

```sh
curl -X GET http://localhost:3000/products \
  -H "Authorization: JWT <your_token_here>"
```

### Add to Cart

```sh
curl -X POST http://localhost:3000/cart/123 \
  -H "Authorization: JWT <your_token_here>"
```

---

## Notes

- Replace `<your_token_here>` with the JWT token received after login.
- All IDs (productID, etc.) should be valid and existing in the database.
- All endpoints expect and return JSON.

---


