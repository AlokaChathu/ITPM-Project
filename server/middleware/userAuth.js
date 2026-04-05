import jwt from 'jsonwebtoken';
import { getUserJwtSecret } from '../config/jwtSecret.js';

const userAuth = async (req,res,next) => {

    const {token} = req.cookies;

    // @validation — Cookie JWT must be present for protected user routes
    if(!token){
        return res.json({success:false,message:"Not authorized to login again"});
    }

    try {

        const jwtSecret = getUserJwtSecret();
        if (!jwtSecret) {
            return res.status(500).json({ success: false, message: "Server JWT secret is not configured" });
        }

        const tokenDecode =  jwt.verify(token,jwtSecret);

        if(tokenDecode.id){
            req.userId = tokenDecode.id;
            // req.body.userId = tokenDecode.id; 
            
        }else{
            return res.json({success:false,message:"Not authorized to login again"});
        }

        next();
        
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}


export default userAuth;