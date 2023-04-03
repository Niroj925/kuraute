import React from 'react'
import io from 'socket.io-client';
import { useEffect,useState } from 'react';
import Navbar from '../component/navbar';
import axios from 'axios'

const socket=io.connect('http://localhost:8080')

function index() {
  const [message,setMessage]=useState('');
  const [msgReceive,setmsgReceive]=useState('');
  const [room,setRoom]=useState('');
  const [user,setUser]=useState([])

const joinRoom=()=>{
    if(room !==""){
      socket.emit("join_room",room)
    }
  }
  const sendMsg=()=>{
    //to emit and listen event we have to add socket.io-client package
    //emit event and send message to the backend 
    socket.emit('send_message',{message,room});
  }

  const getUser=async()=>{
   const response=await axios.get('http://localhost:8080/posts')
  // .then((response) => {
  //   console.log(response.data);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
    setUser(response.data)
  }

  //listent event
  useEffect(()=>{
   socket.on('receive_message',(data)=>{
    setmsgReceive(data.message);
    // alert(data.message)
   })
  //  getUser();
  },[])
const handleClick=()=>{
  getUser()
}
  return (
    <div className='container'>
      <Navbar/>
        <input placeholder='room....'
      onChange={(event)=>{
        setRoom(event.target.value)}}/>

           <button onClick={joinRoom}>Join Room</button><br/>
      <input placeholder='message....'
      onChange={(event)=>{
        setMessage(event.target.value)}}/>
      <button onClick={sendMsg}>Send Msg</button>
                  <h2>message:</h2>
      {msgReceive}
         <button onClick={handleClick}>getuser</button>
         {user.map((item)=>{
            return(
              <h3 key={item.id}>{item.title}</h3>
            )
           })
         }
    </div>
  )
}

export default index