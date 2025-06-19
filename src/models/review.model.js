import mongoose , {Schema} from "mongoose";

const reviewSchema = new Schema({
    name: {type: String, required: true},
    rating: {type: Number, required: true , min: 1, max: 5},
    comment: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    bookId : {type: Schema.Types.ObjectId, ref: 'Book'},

},{timestamps : true});

const Review = mongoose.model('Review', reviewSchema);

export default Review;