import jwt from "jsonwebtoken"
import ApiKey from "../models/apiKey.model.js";
export const apiKeyVerification = async (req, res, next) =>{
    try {
        const authHeader = req.headers["authorization"];
        let apiKey;
        if (authHeader && authHeader.startsWith("Api-Key ")) {
             apiKey = authHeader.split(" ")[1];
        }


        
        if (!apiKey){
            return res.status(400).json({
                success : false , 
                message : "Api Key Missing"
            })

        } 

        
        
        const apiKeyModel = await ApiKey.findOne({apiKey});

        if(!apiKeyModel){
            return res.status(400).json({
                success : false , 
                message : "Api Key Not Found"
            })
        }

        

        if(Date.now() > apiKeyModel.expiresAt){
            return res.status(400).json({
                success : false , 
                message : "Api Key Expired Regenerate"
            })
        }

        next();




        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while verifying Api Key" 
        })
        
        
    }
    
}