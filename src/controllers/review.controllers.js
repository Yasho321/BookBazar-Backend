import Review from "../models/review.model.js";

export const addReview = async (req, res) =>{
    try {
        const {bookId} = req.params;
        
        
        const {name ,rating, comment} = req.body;
        if(!bookId || !name || !rating || !comment){
            
            
            return res.status(400).json({
                success : false,
                message: 'Please fill in all fields'
            });
        }

        const review = await Review.create({
            name ,
            rating ,
            comment ,
            userId : req.user._id ,
            bookId : bookId ,
        });

        if(!review){
            return res.status(400).json({
                success : false ,
                message : 'Failed to add review'
            })
        }

        return res.status(201).json({
            success : true ,
            message : 'Review added successfully',
            review
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false ,
            message : 'Internal server error while adding review',
        })
        
    }



}

export const deleteReview = async (req, res) =>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success : false ,
                message : 'Please provide review id'
            })
        }

        const review = await Review.findById(id);
        
        if(!review){
            return res.status(400).json({
                success : false ,
                message : 'Review not found'
            })
        }
        if(review.userId.toString() !== req.user._id.toString()){
            return res.status(400).json({
                success : false ,
                message : 'You are not authorized to delete this review'
            })
        }

        await review.deleteOne();

        

        return res.status(200).json({
            success : true ,
            message : 'Review deleted successfully',
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false ,
            message : 'Internal server error while deleting review',
        })
        
    }

}

export const getAllReviewsOfBook = async (req, res) =>{
    try {
        const {bookId} = req.params;
        if(!bookId){
            return res.status(400).json({
                success : false ,
                message : 'Please provide book id'
            })
        }

        const reviews = await Review.find({bookId});
        if(!reviews){
            return res.status(400).json({
                success : false ,
                message : 'No reviews found for this book'
            })
        }

        return res.status(200).json({
            success : true ,
            reviews : reviews,
            message : 'Reviews fetched successfully',
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false ,
            message : 'Internal server error while fetching reviews',
        })
        
    }
    
}