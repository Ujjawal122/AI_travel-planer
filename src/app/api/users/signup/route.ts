import User from "@/models/userModel";
import Connect from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";
import bcrypt from "bcryptjs";

Connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody=await request.json()
        const {username,email,password}=reqBody

        const user=await User.findOne({email})

       if(user){
        //agar user hai toh user is already exist hai
        return NextResponse.json({error:"User is already existed"},{status:404})
       }
       const salt=await bcrypt.genSalt(10);
       const hashPassword=await bcrypt.hash(password,salt)

      

       const newUser=new User({
         username,
         email,
         password:hashPassword
       })
       const savedUser=await newUser.save()
       

       return NextResponse.json({
        message:"User Created Successfully",
        user:newUser,
        success:true
       },{status:200})


    } catch (error:any) {
        console.log("Server Error in Signup");
        return NextResponse.json({
            error:error.message ||"Internal issue"
        },{status:500})
        
        
    }
    
}