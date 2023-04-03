import mongoose from "mongoose";
import 'dotenv/config'
const connectDB=async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('mongoDB connected');
    }catch(err){
        console.log("error");
        process.exit();
    }
}

export default connectDB
