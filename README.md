# Bookstore API

A comprehensive RESTful API for managing an online bookstore with user authentication, book inventory, shopping cart, reviews, and order management.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration and login
  - API key generation for secure access
  - Email verification system
  - User profile management

- **Book Management**
  - Add, update, and delete books
  - Get individual book details
  - Browse all books with filtering and search
  - Support for book covers (file upload)

- **Shopping Cart**
  - Create and manage shopping carts
  - Add/remove books from cart
  - Quantity management

- **Order Processing**
  - Create orders from cart items
  - View order history
  - Get detailed order information

- **Review System**
  - Add reviews and ratings for books
  - View book reviews
  - Delete reviews (owner only)

## 🛠️ Tech Stack

### Backend Framework
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework

### Database
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling for Node.js

### Authentication & Security
- **bcryptjs** - Password hashing library
- **jsonwebtoken** - JSON Web Token implementation
- **cookie-parser** - Parse HTTP request cookies

### Payment Integration
- **Razorpay** - Payment gateway for Indian market
- **crypto** - Cryptographic functionality for payment verification

### File Upload & Storage
- **Multer** - Middleware for handling multipart/form-data
- **Cloudinary** - Cloud-based image and video management

### Email Services
- **Nodemailer** - Send emails from Node.js applications

### Development & Configuration
- **dotenv** - Load environment variables from .env file
- **cors** - Cross-Origin Resource Sharing middleware
- **nodemon** - Development tool for auto-restarting server

### Package Management
- **ES Modules** - Modern JavaScript module system (type: "module")

## 🛠️ API Endpoints

### Authentication & API Management
```
POST   /api/v1/auth-and-api/register     # User registration
POST   /api/v1/auth-and-api/login        # User login
GET    /api/v1/auth-and-api/me           # Get user profile
POST   /api/v1/auth-and-api/api-key      # Generate API key
GET    /api/v1/auth-and-api/logout       # User logout
GET    /api/v1/auth-and-api/verify/:token # Email verification
```

### Books
```
POST   /api/v1/books/                    # Add new book
PUT    /api/v1/books/:id                 # Update book
DELETE /api/v1/books/:id                 # Delete book
GET    /api/v1/books/:id                 # Get single book
GET    /api/v1/books/                    # Get all books (with filters , search , sorting and pagination  )
quaries for getting all books (should be attached with the req :- GET    /api/v1/books/) :- genre , author, title, page, limit,sort,search .
```

### Reviews
```
POST   /api/v1/reviews/:bookId           # Add review
DELETE /api/v1/reviews/:reviewId         # Delete review (owner only)
GET    /api/v1/reviews/:bookId           # Get book reviews
```

### Orders
```
POST   /api/v1/orders/                   # Create order
GET    /api/v1/orders/                   # Get user orders
GET    /api/v1/orders/:id                # Get order details
```

### Cart
```
POST   /api/v1/carts/                    # Create cart
GET    /api/v1/carts/                    # Get user carts
GET    /api/v1/carts/:id                 # Get cart details
PUT    /api/v1/carts/add/:id             # Add item to cart
DELETE /api/v1/carts/:id                 # Delete cart
DELETE /api/v1/carts/remove/:id          # Remove item from cart
```

### Payments
```
POST   /api/v1/payments/create           # Create payment order
POST   /api/v1/payments/verify           # Verify payment completion
```

## 🔐 Authentication

The API uses API key authentication. Include the API key in the request header:

```
Authorization: Api-Key YOUR_API_KEY_HERE
```

To get an API key:
1. Register a new user account
2. Login to get authenticated
3. Call the generate API key endpoint

## 📝 Request Examples

### User Registration
```json
POST /api/v1/auth-and-api/register
(needs your mailtraps credentials to use this as it is built on demo account which allows sending testing emails only to your email address in this case mine , if you don't have one you can login with example credentials given after this in user login section)
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### User Login
```json
POST /api/v1/auth-and-api/login
(USE THIS IF YOU DON'T HAVE A MAIL SERVICE CREDENTIALS)
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```


### Add a Book
```json
POST /api/v1/books/
Content-Type: multipart/form-data
Authorization: Api-Key YOUR_API_KEY

title: "The Silent Patient"
author: "Alex Michaelides"
genre: "Psychological Thriller"
pages: 336
price: 499
description: "A woman's act of violence hides a secret."
stock: 10
cover: [file upload]
```

### Create Order
```json
POST /api/v1/orders/
Authorization: Api-Key YOUR_API_KEY
{
  "orderItems": [
    {
      "bookId": "6853576e769b81922ce29a94",
      "price": 499,
      "quantity": 2
    }
  ]
}
```

### Add Review
```json
POST /api/v1/reviews/:bookId
Authorization: Api-Key YOUR_API_KEY
{
  "name": "John Doe",
  "rating": 5,
  "comment": "Excellent book, highly recommended!"
}
```

## 💳 Payment Integration

The API integrates with Razorpay for secure payment processing. The payment flow involves creating a payment order and then verifying the payment completion.

### Payment Flow
1. Create an order using the orders endpoint
2. Create a payment order using the payment create endpoint
3. Process payment on the frontend using Razorpay
4. Verify payment completion using the payment verify endpoint

### Create Payment Order
```json
POST /api/v1/payments/create
Authorization: Api-Key YOUR_API_KEY
{
  "orderId": "6854379e5692798079e0c386",
  "total": 1497
}
```

**Response:**
```json
{
  "success": true,
  "paymentOrderId": "order_razorpay_id",
  "amount": 149700
}
```

### Verify Payment
```json
POST /api/v1/payments/verify
Authorization: Api-Key YOUR_API_KEY
{
  "razorpayPaymentId": "pay_razorpay_payment_id",
  "razorpayOrderId": "order_razorpay_order_id",
  "razorpaySignature": "signature_from_razorpay",
  "amount": 149700,
  "orderId": "6854379e5692798079e0c386"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and order marked as paid",
  "paymentId": "payment_db_id"
}
```

### Payment Security Features
- **Signature Verification**: All payments are verified using HMAC SHA256 signature
- **Order Status Management**: Orders are automatically updated based on payment status
- **Stock Management**: Failed payments automatically restore book stock
- **Payment Tracking**: All payment transactions are stored with complete audit trail

### Payment Status Flow
- **pending** → **paid** (successful payment)
- **pending** → **failed** (failed payment with stock restoration)
- **paid** → **shipped** → **delivered** (order fulfillment)

## 🔍 Query Parameters

### Books Filtering
- `genre` - Filter by book genre
- `author` - Filter by author name
- `title` - Filter by book title
- `sort` - Sort results (e.g., "descPri" for descending price)
- `search` - Search across book fields

Example: `GET /api/v1/books/?genre=Classic&author=George Orwell&sort=descPri`

## 🚦 Getting Started

1. **Start the server** (assumed to be running on `localhost:8080`)
2. **Import the Postman collection** from the provided Documentation
3. **Register a new user** using the registration endpoint (used demo service which do not send emails to other as of now to test you can login via credentials given in user login section)
4. **Generate an API key** for authenticated requests
5. **Start making API calls** using the generated API key

## 📋 Response Format

All API responses follow a consistent JSON format with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🛡️ Security Features

- API key-based authentication
- Email verification for new accounts
- Secure password handling
- Protected routes requiring authentication

## 📚 Data Models

### Book
- Title, Author, Genre
- Pages, Price, Stock quantity
- Description and Cover image
- Reviews and ratings

### User
- Name, Email, Password
- API key for authentication
- Email verification status

### Order
- User reference
- Order items with book details
- Quantities and pricing
- Order status and timestamps

### Cart
- User reference
- Book items with quantities
- Total calculations

---

*This API provides a complete backend solution for an online bookstore with all essential e-commerce features.*
```