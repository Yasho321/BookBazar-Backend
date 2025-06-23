import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import  ApiKey  from "../models/apiKey.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const register = async (req, res) =>{
    try {
        const {name, email, password} = req.body;
        if(!email || !password || !name) {
            return res.status(400).json({
                success : false,
                message : "Please enter all fields"

            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);



        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if(user){
            return res.status(400).json({
                success : false,
                message : "User already exists"
            })

        }

        const newUser = await User.create({
            name: name,
            email : email,
            password: hashedPassword
        })

        if(!newUser){
            return res.status(400).json({
                success : false,
                message: "Failed to create user"

            })
        }

    

        const verificationToken = crypto.randomBytes(32).toString("hex"); 

        newUser.verificationToken = verificationToken;
        await newUser.save();

        const transport = nodemailer.createTransport({
            host : process.env.RESEND_HOST ,
            port : process.env.RESEND_PORT ,
            secure : false ,
            auth : {
                user : process.env.RESEND_USERNAME ,
                pass : process.env.RESEND_PASSWORD ,
            } 
        })
       
        

        const mailOption = {
            from : process.env.RESEND_SENDERMAIL ,
            to : email ,
            subject : "Verify your email",
            text : `Please click on this link to verify your email http://localhost:8080/api/v1/auth-and-api/verify/${verificationToken}`
        }
         


       const sent = await transport.sendMail(mailOption);

       if(!sent){
        return res.status(400).json({
            success : false ,
            message : "Failed to send email"
        })
        
       }

        


        return res.status(201).json({
            success : true,
            message: "User created successfully",
            
            user : {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role : newUser.role
            }
        })


        
    } catch (error) {
        console.error(error);
       return  res.status(500).json({
            success: false,
            message: "Internal server error while creating user"
        })
        
    }

}

export const login = async (req, res) =>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message: "Please provide email and password"
            })
        }

        const user = await User.findOne({email: email});    

        

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
           return res.status(400).json({
                success : false , 
                message : "Wrong Credentials"
            })
        }

        if(!user.isVerified){
            return res.status(400).json({
                success : false ,
                message : "Please verify your email"
            })
        }

         const token = jwt.sign({id: user._id}, process.env.JWTSECRET_KEY, {expiresIn: "7d"});

        const cookiesOption = {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60*1000),
            secure : true,
        }

        res.cookie("token", token , cookiesOption);

       
       return res.status(201).json({
            success : true,
            message: "Login successfully",
            
            user : {
                id: user._id,
                name: user.name,
                email: user.email,
                role : user.role
            }
        })


        

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error while login" 
        })
        
    }

}

export const generateApiToken = async (req, res) =>{
    try {
        const user = await User.findOne({email: req.user.email});

        
        

        if(!user){
           return res.status(404).json({
                success : false ,
                message : "User not found"
            })
        } 

        if(user.apiKey){
            await ApiKey.deleteMany({userId: user._id});
           

        }

        const token = crypto.randomBytes(32).toString("hex") ;

        
        

        const newApiKey = await ApiKey.create({userId: user._id, apiKey: token, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60*1000)}) ;
        
        
        if(!newApiKey){
            return res.status(400).json({
                success : false ,
                message : "Error while generating API token"
            })
        }

        user.apiKey = newApiKey._id;
        await user.save() ;

       

        
        

        
       

        

        return res.status(200).json({
            success : true ,
            message : "API token generated successfully",
            apiKey: newApiKey.apiKey,
            

        })


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false ,
            message : "Internal server error while generating API token"
        })
        
    }

}

export const logout = async (req, res) =>{
    try {
        
        res.clearCookie("token");
        
        return res.status(200).json({
            success : true ,
            message : "Logged out successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false ,
            message : "Internal server error while logging out"
        })
        
    }

}

export const getMe = async (req, res) =>{
    try {
        if(!req.user){
            return res.status(401).json({
                success : false ,
                message : "Unauthorized"
            })
            
        }

        return res.status(200).json({
            success : true ,
            user : req.user
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false ,
            message : "Internal server error while getting user data"
        })
    }
    
}

export const verify = async (req, res) =>{
    try {
        const { token } = req.params;

        if(!token){
            return res.status(400).json({
                success : false ,
                message : "Token is required",
            })
        }

        const verifyingUser = await User.findOne({
            verificationToken : token
        })

        if(!verifyingUser){
            return res.status(400).json({
                success : false ,
                message : "Invalid token"
            })
        }

        verifyingUser.isVerified = true ,
        verifyingUser.verificationToken = undefined,
        await verifyingUser.save()

        return res.status(200).json({
            success : true ,
            message : "Email verified successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false ,
            message : "Internal server error while verifying user"
        })
        
    }
}