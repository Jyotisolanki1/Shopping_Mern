import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';



//register user
export const registerUser = catchAsyncErrors(async(req,res,next)=>{

  const {name,email,password} = req.body;
  const newuser = new User({name,email,password, 
    avatar:{
        public_id : "this is a sample id",
        url: "profilePisURL"
    }
  });
  const user = await newuser.save();
  sendToken(user,201,res);
});

//Login user
export const loginUser = catchAsyncErrors(async(req, res, next)=>{
      const {email, password} = req.body;
      //checking if user has given password and email both
      if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400));
      }  

    const user = await User.findOne({email:email}).select("+password");
    
      if(!user){
        return next(new ErrorHandler("invalid email and password",401));
      }
      const isPasswordMathced = user.comparePassword(password);
      if(!isPasswordMathced){
        return next(new ErrorHandler("Invalid email or password",401));
      }
      sendToken(user,200,res);
      });


//user data Logout
export const logout = catchAsyncErrors( async(req,res,next)=>{
        res.cookie("token",null,{
          expires: new Date(Date.now()),
          httpOnly: true
        })
        res.status(200).json({
          success: true,
          message : "logged out successfully"
        })
    });

//forgot passwrod
export const forgotPassword= catchAsyncErrors(async(req,res,next)=>{
       const user = await User.findOne({email: req.body.email});

        if(!user){
            return next(new ErrorHandler("user not found", 404));
        }
        //get reset password token
        const resetToken = user.getResetPasswordToken();
        await user.save({validateBeforeSave: false});
        const resetPasswordUrl = `http://localhost:8080/api/v1/password/reset/${resetToken}`;
        const message = `your password reset token is :-\n\n ${resetPasswordUrl} \n\n 
        if you have not requested this email then please ignore it`;
        
          try{
              await sendEmail({
              email:user.email,
              subject: `Ecomerce Password recovery`,
              message,
              });
            res.status(200).json({
              success: true,
              message: `Email sent to ${user.email} successfully`
            });
          }catch(error){
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save({
            validateBeforeSave: false
          });
          return next(new ErrorHandler(error.message, 500));
          }
});

export const resetPassword = catchAsyncErrors(async(req,res,next)=>{

  //creating hash token
  const resetPasswordToken = crypto.createHash("sha256").
    update(req.params.token).digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt : Date.now()},
    });
    if(!user){
      return next(new ErrorHandler(
        "Reset password token hs invalid or expired",400
      ));
    }
    if(req.body.password !== req.body.confirmPassword){
      return next(new ErrorHandler(
        "confirm password does not match",400
      ))
    }
    user.password = req.body.password;
    user.resetPasswordToken= undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200,res);
});

//get your details
export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
   const user = await User.findById(req.user.id);
   res.status(200).json({
    success:true,
    user
   })
});

//update user password
export const updatePassword = catchAsyncErrors(async(req,res,next)=>{

  const user = await User.findById({_id:req.user.id}).select("+password");
  
  const isPasswordMathced = await user.comparePassword(req.body.oldPassword); 
 
  if(!isPasswordMathced) {
    return next(new ErrorHandler("Old passwrod is incorrect", 400));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("Password deos not match", 400));
  }
  user.password = req.body.newPassword
  await user.save();
  sendToken(user,200,res);
});
//update user  profile
export const updateProfile = catchAsyncErrors(async(req,res,next)=>{
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }
  //we will add cloudinary later
  const user = await  User.findByIdAndUpdate(req.user.id,newUserData,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success:true
  });
});

//get all users(admin)
export const getAllUsers  = catchAsyncErrors(async(req,res,next)=>{
  const users = await User.find();
  res.status(200).json({
    success: true,
    users
  });
});

//get signle users(admin)
export const getSingleUser  = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`user does niot exits with is:${req.params.is}`))
  }
  res.status(200).json({
    success: true,
    user
  });
});

//update user from admin site

export const updateUserRole = catchAsyncErrors(async(req,res,next)=>{
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role

  }
  //we will add cloudinary later
  const user = await  User.findByIdAndUpdate(req.user.id,newUserData,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success:true
  });
});

//delete user from admin side
export const deleteUser = catchAsyncErrors(async(req,res,next)=>{
  const user = await  User.findById(req.params.id);
  if(!user){
    return next(
      new ErrorHandler(`user deos not exit with this given id: - ${req.params.id}` )
    )
  }
  //we will add cloudinary later
  await user.deleteOne({_id:req.params.id});
  res.status(200).json({
    success:true,
    message: "user deleted succefully"
  });
});





