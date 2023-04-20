import express from "express"
import cors from "cors"
import http from "http"
import {Server }from "socket.io"
import axios from "axios";
import connectDB from "./config/db_conn.js";
import router from './route/userRoutes.js';
import {notfound,errHandler} from './middleware/errMiddleware.js';
import chatRoute from './route/chatRoute.js';
import messageRoute from "./route/messageRoute.js";
import path from 'path';
import 'dotenv/config'

const app=express();
const PORT=process.env.PORT||8080;

app.use(express.json());//to accept json data
app.use(cors());

connectDB();

app.use('/api/user',router);
app.use('/api/chat',chatRoute);
app.use('/api/message',messageRoute);

app.get('/posts', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//deployment
const __dirname=path.resolve();

if(process.env.NODE_ENV==='production'){
 app.use(express.static(path.join(__dirname,"/client/.next/server/pages")));

 app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"client",".next","server","pages","index.html" ))
 })
}else{
  app.get("/",(req,res)=>{
    res.send('API is running successfully')  
  })
}

//to handle error
app.use(notfound);
app.use(errHandler);

const server=http.createServer(app);

const users = {}; 

const io=new Server(server,{
  pingTimeout:50000,
    cors:{
    origin:"http://localhost:3000",
    // origin:"https://kuraute.netlify.app",
    methods:["GET","POST","PUT","DELETE"]
    }
})

io.on('connection',(socket)=>{
    console.log(`user connected to socket.io`);

    //listen event
     socket.on('setup',(userData)=>{
       console.log(userData);
       users[socket.id] = userData;
       socket.join(userData);
       socket.emit("connected")

        // send the updated list of logged-in users to all connected sockets
    socket.emit('user list', users);
    
    })

    socket.on('join chat',(room)=>{
        //id of the room 
        socket.join(room)
        console.log('user joined room:'+room);
    })

    socket.on('typing',(room)=>{
      socket.to(room).emit('typing')
    })

    socket.on('stop typing',(room)=>
    {
      socket.to(room).emit('stop typing')
    })


    socket.on('new message',(newMessageReceived)=>{
      console.log('message received:')
      console.log(newMessageReceived)
      console.log('user:');
      console.log(newMessageReceived.chat.user)
      var chat=newMessageReceived.chat;
      console.log(chat._id)
      if(!chat || !chat.user) return console.log('chat.user not defined');
    
      chat.user.forEach((usr)=>{
        if(usr._id == newMessageReceived.sender._id) return ;
        console.log(usr.name);
        socket.to(chat._id).emit('message received',newMessageReceived)
      })
    })


    socket.on('disconnect', (userData) => {
      console.log('user disconnected');
      socket.leave(userData._id);

      delete users[socket.id];
    // send the updated list of logged-in users to all connected sockets
    io.emit('user list', Object.values(users));
    });
 
})

 server.listen(PORT,()=>{
  console.log("server is running");
})

