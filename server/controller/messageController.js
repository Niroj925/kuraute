
import messageModel from '../model/messageModel.js';
import userModel from '../model/userModel.js';
import generateToken from '../config/generateToken.js';
import bcrypt from 'bcrypt';
import "dotenv/config";
import chatModel from '../model/chatModel.js';

export default class MessageController{
    async sendMessage(req,res){
        const {msg,chatId}=req.body;
        if(!msg||!chatId){
          res.status(400);
          throw new Error('invalid data passed');
        }

        var newMessage={
            sender:req.userId,
            content:msg,
            chat:chatId
        }
        try{
            var message =await messageModel.create(newMessage);
           
            message=await message.populate("sender","name");
            message=await message.populate("chat");

           message=await userModel.populate(message,{
            path:"chat.user",
            select:"name email"
           })

           await chatModel.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
           })

           res.json(message);

        }catch(err){
            res.status(400);
            throw new Error(err.message);

        }
        
}

async getMessage(req, res) {
try{

    const message=await messageModel.find({chat:req.params.chatId})
    .populate("sender" ,"name email" )
    .populate("chat");

    res.json(message);

}catch(err){
res.json(400)
throw new Error(err.message);
}
}


}