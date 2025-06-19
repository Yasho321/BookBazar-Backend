import mongoose , {Schema} from "mongoose";

const orderSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    orderItems: [
        {
            bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
            quantity: { type: Number, default: 1 }
        }
    ],
    total: {type: Number},
    status: {type: String, enum: ['paymentPending','paid', 'shipped', 'delivered']},
    paymentId : {type: Schema.Types.ObjectId, ref: 'Payment' },

},{timestamps : true})

 const Order = mongoose.model('Order', orderSchema);
 export default Order ;