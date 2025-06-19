import Cart from "../models/cart.model.js";

export const createCart = async(req , res) =>{
    try {
        const userId = req.user._id;
        const {bookId , quantity} = req.body;
        if(!bookId || !quantity){
            return res.status(400).json({
                success : false ,
                message : "Please provide book id and quantity"
            })
        }
        const cart = await Cart.create({
            userId ,
            bookId ,
            quantity
        })

        if(!cart){
            return res.status(400).json({
                success : false ,
                message : "Failed to create cart"
            })
        }
        return res.status(201).json({
            success : true ,
            message : "Cart created successfully",
            cart
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false ,
            message : "Internal server error while creating cart"
            
        })
        
    }

}

export const getCart = async(req , res) =>{
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(400).json({
                success : false ,
                message : "Please login to access cart"
            })
        }

        const cart = await Cart.find({userId}).populate("bookId", "title price");

        if(!cart){
            return res.status(404).json({
                success : false ,
                message : "Cart not found"
            })
        }

        return res.status(200).json({
            success : true ,
            message : "Cart retrieved successfully",
            cart
        })

        
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : "Internal server error while retrieving cart"
        })
        
    }

}

export const deleteCart = async (req,res) =>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success : false ,
                message : "Please provide cart id"
            })
        }

        const cart = await Cart.findByIdAndDelete(id);
        if(!cart){
            return res.status(404).json({
                success : false ,
                message : "Cart not found"
            })
        }

        return res.status(200).json({
            success : true ,
            message : "Cart deleted successfully"
        })

        
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : "Internal server error while deleting cart"
        })
        
    }

}

export const updateCart = async (req,res) =>{
    try {
        const {id} = req.params;
        const {bookId ,quantity} = req.body;
        if(!id || !bookId || !quantity){
            return res.status(400).json({
                success : false ,
                message : "Please provide cart id , book id and quantity"
            })
        }

        const cart = await Cart.findByIdAndUpdate(id , {bookId , quantity} , {new : true});
        if(!cart){
            return res.status(404).json({
                success : false ,
                message : "Cart not found"
            })
        }

        return res.status(200).json({
            success : true ,
            message : "Cart updated successfully",
            data : cart
        })
        
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : "Internal server error while updating cart"
        })
        
    }

}

export const getCartDetails = async (req,res) =>{
    try {
        const userId = req.user._id;
        const id = req.params.id;
        if(!id){
            return res.status(400).json({
                success : false ,
                message : "Invalid cart id"
            })
        }
        if(!userId){
            return res.status(400).json({
                success : false ,
                message : "Please login to access cart"
            })
        }

        const cart = await Cart.findById({_id :id}).populate("bookId");

        if(!cart){
            return res.status(404).json({
                success : false ,
                message : "Cart not found"
            })
        }

        return res.status(200).json({
            success : true ,
            message : "Cart retrieved successfully",
            cart
        })

        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success : false ,
            message : "Internal server error while retrieving cart"
        })
        
    }

}