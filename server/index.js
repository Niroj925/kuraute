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
    cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST","PUT","DELETE"]
    }
})

io.on('connection',(socket)=>{
    console.log(`user connected id :${socket.id}`);

    // //listen event
    // socket.on('send_message',(data)=>{
    //     console.log(data);
    //     socket.broadcast.emit('receive_message',data)
    // })

    socket.on('join_room',(data)=>{
        //id of the room 
        socket.join(data)
    })

    socket.on('send_message',(data)=>{
        socket.to(data.room).emit('receive_message',data)
    })
})

server.listen(8080,()=>{
    console.log("server is running");
})