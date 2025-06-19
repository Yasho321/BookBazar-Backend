import Order from "../models/order.model.js";
import Book from "../models/book.model.js";

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
        const {orderItems } = req.body;
        const userId = req.user.id;

    
        if((!orderItems || !Array.isArray(orderItems) || orderItems.length === 0 )){
            return res.status(400).json({
                success : false,
                message : "Order items are required"
            });
        }

        const total = orderItems.reduce((acc, item) => acc + item.quantity*item.price, 0);
        
        const formattedItems = orderItems.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
        }));

        

        const order = await Order.create({
            userId ,
            orderItems : formattedItems ,
            total  ,
            status : "paymentPending",
        }) ;

        for(let i=0; i<orderItems.length ; i++){
            const item = orderItems[i];
            const book = await Book.findById(item.bookId);

            if(book.stock < item.quantity){
                return res.status(400).json({
                    success : false,
                    message : "Not enough stock"
                })
            }

            book.stock -= item.quantity ;
            await book.save();
        }
        
        
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