
import chatModel from '../model/chatModel.js';
import generateToken from '../config/generateToken.js';
import bcrypt from 'bcrypt';
import "dotenv/config";
import userModel from '../model/userModel.js';

export default class ChatController{
    async fetchChats(req,res){
        try{
         chatModel.find({user:{$elemMatch:{$eq:req.userId}}})
         .populate('user','-password')
         .populate('groupAdmin','-password')
         .populate('latestMessage')
         .sort({updatedAt:-1})
         .then(async (result)=>{
            result=await userModel.populate(result,{
                path:"latestMessage.sender",
                select:"name pic email",
            });
            res.status(200).send(result);
         })
            
          
        }catch(err){
            console.log(err);
        }
}

async accessChats(req,res){
       
 const {id}=req.body;

 if(!id){
    console.log('userid param not sent with request');
    return res.sendStatus(400);
 }

 var isChat=await chatModel.find({
    isGroupChat:false,
    $and:[
        {user:{$elemMatch:{$eq:req.userId}}},
        {user:{$elemMatch:{$eq:id}}},
    ]
 })
 .populate("user","-password")
 .populate("latestMessage");

 isChat=await userModel.populate(isChat,{
    path:"latestMessage.sender",
    select:"name pic email",
 });
 if(isChat.length>0){
    res.send(isChat[0]);
 }else{
    var chatData={
       chatName:"sender",
       isGroupChat:false,
       user:[req.userId,id]
    };
    try{
        const createdChat=await chatModel.create(chatData);
        const Fullchat=await chatModel.findOne({_id:createdChat._id}).populate(
            "user",
            "-passwords"
        );
        res.status(200).send(Fullchat);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
        
 }
}

async createGroupChat(req,res){
    if(!(req.body.users||req.body.name)){
        return res.status(400).send({message:'please fill all the field'});
    }
    var users=JSON.parse(req.body.users);
    if(users.length<2){
        return res
        .status(400)
        .send('user should more than 2');
    }
    // add all users along with login users 

    users.push(req.userId);

    try{
        const groupChat=await chatModel.create({
            chatName:req.body.name,
            user:users,
            isGroupChat:true,
            groupAdmin:req.userId
        });
        const fullGroupChat=await chatModel.findOne({_id:groupChat._id})
        .populate('user','-password')
        .populate('groupAdmin','-password')

        res.status(200).json(fullGroupChat)

    }catch(err){
        res.status(400);
        throw new Error(err.message);
    }

}

async renameGroup(req,res){
    const {chatId,chatName}=req.body;

    const updatedChat=await chatModel.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
         new:true,   
        }
    )
    .populate('user','-password')
    .populate('groupAdmin','-password');

    if(!updatedChat){
        res.status(404);
        throw new Error ('chat not found');
    }else{
        res.json(updatedChat);
    }
}

}