import User from "@/models/userModel";
import Connect from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { error } from "console";
import jwt from "jsonwebtoken";

Connect()
export async function POST(request:NextRequest) {
    try {
        const reqBody=await request.json()
        const{email,password}=reqBody

        //finding the user-->
        const user=await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"User does not exits"},{status:404})
        }
        const isValidPassword=await bcrypt.compare(password,user.password)

        if(!isValidPassword){
            return NextResponse.json({error:"You enter the Wrong Password"},{status:401})
        }

        const tokenData={
            id:user._id,
            email:user.email,
            username:user.username
        }

        const token=await jwt.sign(tokenData,process.env.JWT_KEY!,{expiresIn:"1d"})

        const response=NextResponse.json({
            message:"Login Successfully",
            success:true
        })
        response.cookies.set("token",token,{
            httpOnly:true
        })
        return response;

    } catch (error :any) {
           console.error("Server Error in Login:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 })
    }

}