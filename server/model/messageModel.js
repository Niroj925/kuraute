import mongoose from "mongoose";

const messageSchema=mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    content:{type:String,trim:false},
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"chat"}
},
{
    timestamps:true,
}
)

const messageModel=mongoose.model('message',messageSchema);

export default messageModel;