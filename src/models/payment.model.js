import mongoose , { Schema} from "mongoose";

const paymentSchema = new Schema({
    razorpayId : {
        type: String,
        required: true
    },
    razorpayOrderId : {
        type: String,
        required: true
    },
    razorpaySignature : {
        type: String,
        required: true
    },
    amount : {
        type: Number,
        required: true
    },
   
    status : {
        type: String,
         enum: ['created', 'paid', 'failed'],
        required: true
    },
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    orderId : {
        type: Schema.Types.ObjectId,
        ref: 'Order',
    },

},{timestamps : true});

const Payment = mongoose.model("Payment", paymentSchema) ;
export default Payment;