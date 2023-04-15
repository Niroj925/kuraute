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


  return (
    <div className='container'>
      <Navbar/>     
    </div>
  )
}

export default index