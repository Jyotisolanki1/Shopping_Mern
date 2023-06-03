import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from '../models/userModel.js';
import  Jwt  from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
export const isAuthenticatedUser = catchAsyncErrors( async(req,res,next)=>{
    const {token} = req.cookies;
     if(!token){
        return next(new ErrorHandler("please log in to access this resource",401));
     }
     
    const decodedData = Jwt.verify(token,"kjgjiooriuiituuutriut");
     req.user = await User.findById(decodedData.id);
     next()
     
});
export const authorizeRoles = (...roles) =>{
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(
         new ErrorHandler(`role : ${req.user.role} is not allow to access this resource`,403)
            )
        };
        next();
    }
    
}