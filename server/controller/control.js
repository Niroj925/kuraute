
import userModel from '../model/userModel.js';
import generateToken from '../config/generateToken.js';
import bcrypt from 'bcrypt';
import "dotenv/config";

export default class AuthController{
    async register(req,res){
        const {username,email,password}=req.body;
        // if(!username||!email||!password){
        //   res.status(400);
        //   throw new Error('all the field are required');
        // }
        const emails=await userModel.findOne({email:req.body.email});
        // console.log(emails);
        if(emails){
            res.json({msg:'email already exist'});
        }else{
          try {
            const response = await userModel.create({...req.body});
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
async authUser(req,res){
       
  try{
      //response of database
      const response=await userModel.findOne({ email:req.body.email});
      // console.log(response);
      
      if(response===null){
          return res.json({success:false,msg:"user does not exist"});
      }else{
          //comapre with previously set credentials
          const match=bcrypt.compareSync(req.body.password,response.password);

          if(match){
              console.log('valid user')

            const token=  generateToken(response._id);
             
              console.log(token);

               res.json({...response.toObject(), token}); 
          }else{
              res
              .status(403)
              .json({success:false,message:"invalid credentials"});
          }
      }
  }catch(err){
   res.json(err);
  }
}

// async getAllUser(req,res){
// const keyword=req.query
// ?{
//   $or:[
//     {name:{$regex:req.query.search,$options:"i"}},
//     {email:{$regex:req.query.search,$options:"i"}}
//   ]
// }
// :{

// }
// const user=await (await userModel.find(keyword)).find({_id:{$ne:req.query.id}})

// res.json(user)
// }
async getAllUsers(req, res) {
  const keyword = req.query
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const userId = req.query.id;

  const users = await userModel.find({
    ...keyword,
    _id: { $ne: userId },
  });

  res.json(users);
}


}