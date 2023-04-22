import Head from 'next/head'
import React from 'react'
import Navbar from '../component/navbar';
import  HomePage from '../component/homepage';
import Footer from '../component/footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Kuraute</title>
        <meta name="description" content="kuraute realtime chat app " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
      <Navbar/>    
      <HomePage/> 
      <Footer/>
      </div>
    </>
  )
}
