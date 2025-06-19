import Order from "../models/order.model.js";

export const getOrdersByUser = async (req, res) =>{
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(401).json({
                success : false , 
                message: "Unauthorized"
            });
        }

        const orders = await Order.find({
            userId : userId
        });
        if(!orders){
            return res.status(404).json({
                success : false ,
                message: "No orders found"
            })
        }
        return res.status(200).json({
            success : false , 
            message : "Orders found",
            orders : orders
        })
        
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error while fetching orders"
        })

        
    }

}

export const getOrderDetails = async (req, res) =>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success : false,
                message : "Order id is required"
            });
        }

        const order = await Order.findById(id).populate("orderItems.bookId", "name price author genre");
        if(!order){
            return res.status(404).json({
                success : false,
                message : "Order not found"
            })
        }

        return res.status(200).json({
            success : true,
            data : order,
            message : "Order fetched successfully"
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Internal server error while fetching order"
        })
        
        
    }

}

export const createOrder = async (req, res) =>{
    try {
        const {bookId, quantity, bookPrice } = req.body;
        const userId = req.user.id;
    
        if(!bookId || !quantity || !bookPrice ){
            return res.status(400).json({
                success : false,
                message : "Please fill all the fields"
            });
        }

        const order = await Order.create({
            userId ,
            orderItems : [{
                bookId ,
                quantity ,
            }],
            total : bookPrice * quantity ,
            status : "paymentPending",
        }) ;
        
        
        if(!order){
            return res.status(400).json({
                success : false ,
                message : "Failed to create order"
            })
        }
        return res.status(201).json({
            success : true ,
            data : order ,
            message : "Order created successfully"
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error While Creating Order" 
        })
        
    }
}