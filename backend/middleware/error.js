import ErrorHandler from "../utils/errorHandler.js";

export default (err,req,res,next)=>{  
   err.statusCode = err.statusCode || 500;
   err.message = err.message || "Internal servel error";

    //mongoose duplicate key error
   if(err.code === 11000){
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      err= new ErrorHandler(message,400);
      }
   
   //wrong json web token error
   if(err.name === "JsonWebTokenError"){
    const message = `Json web Token is invalid try again`;
    err = new ErrorHandler(message, 400);
   }

   //jwt expire error 
   if(err.name === "TokenExpiredError"){
      const message = `Json web Token is expried, try again`;
      err = new ErrorHandler(message, 400);
     }

   res.status(err.statusCode).json({
    success: false,
    error: err.message
   });

  
   
}

