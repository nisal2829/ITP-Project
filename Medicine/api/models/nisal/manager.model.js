import mongoose from "mongoose";

const ManagerSchema =new mongoose.Schema({
    username:{
        type:String,
       
       
    },
    email:{
        type:String,
     
       
    },
    password:{
        type:String,
     
     
    },
   
},{timestamps:true});

const Manager=mongoose.model("nADMIN",ManagerSchema)

export default Manager;