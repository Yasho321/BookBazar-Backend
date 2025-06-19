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

        console.log(bookId);
        
        const cart = await Cart.create({
            userId ,
            orderItems :[
                {
                    bookId ,
                    quantity
                }
            ]
            
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

        const cart = await Cart.find({userId}).populate("orderItems.bookId", "title price");

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

export const addToCart = async (req,res) =>{
    try {
        const {id} = req.params;
        const {bookId ,quantity} = req.body;
        if(!id || !bookId || !quantity){
            return res.status(400).json({
                success : false ,
                message : "Please provide cart id , book id and quantity"
            })
        }

        let cart = await Cart.findById(id);
        if(!cart){
            console.log("cart yes");
            
            cart = await Cart.create({
                userId : req.user._id ,
                orderItems : [{
                    bookId ,
                    quantity
                }]
            })
        }else {
            console.log("cart no");
            const existingOrderItem = cart.orderItems.find(item => {
               
                
                return item.bookId.toString() === bookId;
            });
            if(existingOrderItem){
                existingOrderItem.quantity += quantity
            }else{
                cart.orderItems.push({
                    bookId ,
                    quantity
                })
            }
            cart.save();
        }


        return res.status(200).json({
            success : true ,
            message : "Cart updated successfully",
            data : cart
        })
        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success : false ,
            message : "Internal server error while adding to cart"
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

        const cart = await Cart.findById({_id :id}).populate("orderItems.bookId");

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

export const deleteFromCart = async (req,res) =>{
    try {
       
        const id = req.params.id;
        const {bookId} = req.body;
        if(!id || !bookId){
            return res.status(400).json({
                success : false ,
                message : "Invalid cart id or book id"
            })
        }

        const cart = await Cart.findById({_id :id});
        if(!cart){
            return res.status(400).json({
                success : false ,
                message : "Could not find cart"
            })
        }
        const existingOrderItem = cart.orderItems.find(item => item.bookId.toString() === bookId);
        console.log(existingOrderItem);
        

            if(existingOrderItem.quantity>1 ){
                existingOrderItem.quantity = existingOrderItem.quantity-1
                
            }else{
                cart.orderItems = cart.orderItems.filter(item => item.bookId.toString() !== bookId);
                
            }
            cart.save();

            return res.status(200).json({
                success : true ,
                message : "Book removed from cart",
                cart 
            })



        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false ,
            message : "Internal server error while deleting from cart"
        })
        
    }

}