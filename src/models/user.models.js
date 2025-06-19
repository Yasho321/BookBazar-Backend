import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    verificationToken : {
        type : String,
        required : false


    },
    isVerified : {
        type : Boolean,
        default : false
    },
    avatar : {
       type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://avatar.iran.liara.run/public`,
        localPath: "",
      },
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    apiKey : {
        type : Schema.Types.ObjectId,
        ref : 'ApiKey'

    },
    reviews :  [
            {
                type : Schema.Types.ObjectId,
                ref : 'Review'
            }
        ]
    ,
    
    payments :  [
            {
                type : Schema.Types.ObjectId,
                ref : 'Payment'
            }
        ]
   ,
    address : {
        type : String,
        
    },
    phone : {
        type : String,
        
    },
    booksAdded :  [{
            type : Schema.Types.ObjectId,
            ref : 'Book'
        }]
    ,
   
    





},{
    timestamps : true
})

const User = mongoose.model('User', userSchema);

export default User;