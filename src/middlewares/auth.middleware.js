import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
export const isLoggedIn = async (req, res, next) =>{
    try {
        

        const token = req.cookies?.token;

        if(!token){
            res.status(400).json({
                success : false , 
                message : "No Token Found"
            })
        }

        const decoded = await jwt.verify(token , process.env.JWTSECRET_KEY) ;

        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            res.status(400).json({
                success : false ,
                message : "User Not Found via token"
            })
        }

        req.user = user ; 

        next();
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success : false ,
            message : "Error while authentic token",
        })
    }

}

export const isAdmin = (req, res, next) =>{
    try {
        const user = req.user ;
        if(user.role !== "admin"){
            return res.status(400).json({
                success : false ,
                message : "You are not an admin"
            })
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success : false ,
            message : "Error while checking admin role",
        })
        
    }
    
}