import mongoose , {Schema, SchemaType} from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId ,
        ref: 'User'
    },
    bookId : {
        type: Schema.Types.ObjectId ,
        ref: 'Book'

    },
    quantity: {
        type: Number ,
        default: 1
    }

} , {timestamps : true})

cartSchema.index({ userId: 1, bookId: 1 }, { unique: true });

 const Cart = mongoose.model('Cart' , cartSchema);
 export default Cart ;
