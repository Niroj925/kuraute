import jwt from 'jsonwebtoken';
import userModel from '../model/userModel';
import asyncHandler from 'express-async-handler';
import "dotenv/config"

const protect=asyncHandler(async (req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')

    ){
        try{
            token=req.headers.authorization.split(" ")[1];

            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await userModel.findById(decoded.id).select("-password")
        }catch(error){
            res.status(401);
            throw new Error('not authorized,token failed');
        }
    }
    if(!token){
        res.status(401);
        throw new Error ("not authorized,no token");
    }
})  

export default protect