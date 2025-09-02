import mongoose, { Schema } from "mongoose";

const userSchema=new mongoose.Schema({
     username:{
        type:String,
        unique:true,
        required:[true,"Please provide a username"]
    },
    email:{
          type:String,
        unique:true,
        required:[true,"Please provide a email"]
    },
    password:{
        type:String,
        required:[true,"Please provide a password"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    forgetPasswordToken:String,
    forgetPasswordTokenExpriy:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,

},
{timestamps:true}
)

const User=mongoose.models.User||mongoose.model("User",userSchema)

export default User;