import React from 'react'
import Navbar from '../component/navbar';
import  HomePage from '../component/homepage';
import Footer from '../component/footer';

function index() {

  return (
    <div className='container'>
      <Navbar/>    
      <HomePage/> 
      <Footer/>
    </div>
  )
}

export default index