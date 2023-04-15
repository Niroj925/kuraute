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

const app=express();
app.use(express.json());//to accept json data
app.use(cors());

connectDB();

app.use('/api/user',router);
app.use('/api/chat',chatRoute);
app.use('/api/message',messageRoute);
//to handle error
app.use(notfound);
app.use(errHandler);
app.get('/posts', async (req, res) => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

const server=http.createServer(app);

const io=new Server(server,{
  pingTimeout:50000,
    cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST","PUT","DELETE"]
    }
})

io.on('connection',(socket)=>{
    console.log(`user connected to socket.io`);

    //listen event
     socket.on('setup',(userData)=>{
       console.log(userData);
       socket.join(userData);
       socket.emit("connected")
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
        // socket.to(usr._id).emit('message received',newMessageReceived)
        socket.to(chat._id).emit('message received',newMessageReceived)
      })
    })


    // socket.on('send_message',(data)=>{
    //     socket.to(data.room).emit('receive_message',data)
    // })
 
})

 server.listen(8080,()=>{
  console.log("server is running");
})

