import Razorpay from "razorpay";
import { razorpayInstance } from "../utils/razorpay.js";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.models.js";

export const createPayment = async (req, res) =>{
    try {
        const { orderId , total } = req.body;
        if(!orderId || !total) {
            return res.status(400).json({
                success : false,
                message : "Order id and total are required"
            });
        }

        const options = { 
            amount : total * 100 ,
            currency : "INR",
            receipt : orderId 
        }

        const payment = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success : true,
            paymentOrderId : payment.id,
            amount : payment.amount,
        })



        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error while creating payment"
        })
        
        
    }

}

export const verifyPayment = async (req, res) =>{
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature , amount , orderId} = req.body;
    try {
        const userId = req.user.id;
        if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !amount || !orderId) {
            return res.status(400).json({
                success: false,
                message: "All Razorpay payment details are required"
            });
        }
        const verifyingToken = razorpayOrderId + '|' + razorpayPaymentId ;

        

        const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(verifyingToken.toString()).digest("hex");
        if(expectedSignature !== razorpaySignature) {
            return res.status(400).json({
                success : false,
                message : "Invalid signature"
            })
        }

        const payment = await Payment.create({
            userId : userId ,
            orderId,
            status : "paid",
            amount : amount ,
            razorpaySignature,
            razorpayOrderId,
            razorpayId : razorpayPaymentId
        })

        if(!payment){
            return res.status(400).json({
                success : false,
                message : "Payment not able to create in db"
            })
        }

        const order = await Order.findByIdAndUpdate({_id : orderId},{
            paymentId : payment._id ,
            status : "paid"
        } , {new : true}) 

        if(!order){
            return res.status(400).json({
                success : false,
                message : "order can not be set"
            })
        }

        const user = await User.findByIdAndUpdate({_id : userId},{
            paymentId : payment._id ,
        },{new : true})
        if(!user){
            return res.status(400).json({
                success : false,
                message : "user can not be set"
            })
        }
        return res.status(200).json({
            success : true ,
            message : "Payment Successfull"
        })


        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error while processing payment"
        })

        
    }
    
}