import mongoose from "mongoose";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';



const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "name is required"],
        maxLength: [30, "cname can not exceed 30 charactors"],
        minlength: [4,"name should have more than 5 charactor"]
    },
    email:{
        type:String,
        required: [true, "email is required"],
        unique: true,
        validator:[validator.isEmail,"Please entewr a valid Email"]
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minLength: [8, "password can not exceed 30 charactors"],
        select: false
    },
    avatar:
        {
        public_id:{
        type : String,
        required:true
        },
        url:{
            type:String,
            required: true
        }
    },
    role:{
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

});
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password =await bcryptjs.hash(this.password,10);
});

//jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},"kjgjiooriuiituuutriut",{
        expiresIn: "5d" 
    })
}
userSchema.methods.comparePassword = async function(enterPassword){
  
     return await bcryptjs.compare(enterPassword, this.password);
}
//generating password reset token
userSchema.methods.getResetPasswordToken = function (){
    //generating tken
    const resetToken = crypto.randomBytes(20).toString("hex");
    //hashig and add to user schema
    this.resetPasswordToken = crypto.createHash("sha256").
    update(resetToken).digest("hex");
    
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return resetToken;
}

const User = mongoose.model('User',userSchema)
export default User;