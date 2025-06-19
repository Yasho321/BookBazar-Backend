import mongoose , {Schema, SchemaType} from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId ,
        ref: 'User'
    },
   orderItems : [{
        bookId : {
            type: Schema.Types.ObjectId ,
            ref: 'Book'

        },
        quantity: {
            type: Number ,
            default: 1
        }}
   ]


} , {timestamps : true})



 const Cart = mongoose.model('Cart' , cartSchema);
 export default Cart ;
