import mongoose , {Schema} from "mongoose";

const bookSchema = new Schema({
    title: String,
    author: String,
    genre: String,
    pages: Number,
    published: Date,
    coverImg : {
        type : {
            url : String , 
            localPath : String
        },
        default : {
            url : '',
            localPath : ''
        }
    },
    description: String,
    addedBy : {
        type : Schema.Types.ObjectId ,
        ref : 'User'
    },
    stock : {
        type : Number ,
        default : 0
    },
    
    orderedBy : [{
        type : Schema.Types.ObjectId ,
        ref : 'User'
    }],
    orderIds : [{
        type : Schema.Types.ObjectId ,
        ref : 'Order'
    }],
    cartIds : [{
        type : Schema.Types.ObjectId ,
        ref : 'Cart'
    }],
    price : {
        type : Number ,
        default : 0
    }


},{timestamps : true}); 

 const Book = mongoose.model('Book', bookSchema);

 export default Book;
