import mongoose  from "mongoose";
const chatSchema=mongoose.Schema({
    chatName:{
     type:String,
     trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    user:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
        }
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message"
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},
{
    timestamps:true
}
)

const chatModel=mongoose.model("chat",chatSchema);

export default chatModel;