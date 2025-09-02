import { error } from "console";
import mongoose from "mongoose";

export default function Connect(){
    try{
        //connect the mongoose-->
        mongoose.connect(process.env.MONGO_URL!)
        const connection=mongoose.connection;
        connection.on('connected',()=>{
            console.log("Mongodb connected successfully");
            
        })
        connection.on('error',()=>{
            console.log("Mongodb connection error.Please make sure Mongodb connected" + error);
            
        })
    } catch(error){
        console.log("Something goes Wrong");
        
    }  
}