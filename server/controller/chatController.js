
import chatModel from '../model/chatModel.js';
import generateToken from '../config/generateToken.js';
import bcrypt from 'bcrypt';
import "dotenv/config";
import userModel from '../model/userModel.js';

export default class ChatController{
    async fetchChats(req,res){
        const {username,email,password}=req.body;
        // if(!username||!email||!password){
        //   res.status(400);
        //   throw new Error('all the field are required');
        // }
        const emails=await chatModel.findOne({email:req.body.email});
        // console.log(emails);
        if(emails){
            res.json({msg:'email already exist'});
        }else{
          try {
            const response = await chatModel.create({...req.body});
            const token = generateToken(response._id);
            if (response === null) {
              return res.json([]);
            } else {
              return res.json({...response.toObject(), token}); // Add the token to the response object
            }
          } catch (err) {
            return res.json(err);
          }
          
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
        {users:{$elemMatch:{$eq:req.userId}}},
        {users:{$elemMatch:{$eq:id}}},
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

async getAllUsers(req, res) {
  const keyword = req.query
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // get login user id from middleware validation
  const id = req.id; 
   console.log(id);
  const users = await chatModel.find({
    ...keyword,
    _id: { $ne: id },
  });

  res.json(users);
}


}