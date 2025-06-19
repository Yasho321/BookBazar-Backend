import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import reviewRoutes from './routes/review.routes.js';
import authAndApiRoutes from './routes/authAndApi.routes.js';
import bookRoutes from './routes/book.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import cartRoutes from './routes/cart.routes.js'

dotenv.config()

import db from './utils/db.js';
import cookieParser from 'cookie-parser';

const app = express();

const port= process.env.PORT || 8080;




app.use(cors({
    origin: ['*'],

}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth-and-api",authAndApiRoutes);
app.use("/api/v1/books",bookRoutes);
app.use("/api/v1/reviews",reviewRoutes);
app.use("/api/v1/orders",orderRoutes);
app.use("/api/v1/payments",paymentRoutes);
app.use("/api/v1/carts",cartRoutes)

db();

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

app.get("/api/v1/healthcheck",(req,res)=>{
    res.send("Server is running")
})

