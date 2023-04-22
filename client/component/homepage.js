import React from 'react';
import { useRouter } from 'next/router';

import 'bootstrap/dist/css/bootstrap.min.css';
const HomePage = () => {
  const router = useRouter();

  return (
    <div style={{ padding: '5px', margin: '10px' }}>
      <div
        style={{
          height: '100vh',
          backgroundImage: 'url("../image/bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          marginBottom: '10px',
          color: 'grey',
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Welcome to Kuraute</h1>
      </div>

      <div style={{ maxWidth: 'md', marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '50%' }}>
            <h2 style={{ marginBottom: '10px' }}>What is Kuraute?</h2>
            <p style={{ marginBottom: '10px' }}>
              Kuraute is a real-time chat web application that allows you to communicate with your
              friends, family, or colleagues. It's fast, easy to use, and completely free.
            </p>
            <p style={{ marginBottom: '10px' }}>
              With Kuraute, you can create groups, invite people, and start chatting instantly. You
              can also send photos, videos, and documents to your contacts.
            </p>
            <button
              style={{
                backgroundColor: 'blue',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                border: 'none',
                marginBottom: '10px',
              }}
              onClick={() => router.push('/signup')}
            >
              Sign Up Now
            </button>
          </div>
          <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
              <img
                src="../image/snr.png"
                alt="Chat on Kuraute"
                style={{ minWidth: '200px', minHeight: '200px', flexShrink: 0 }}
              />
              <h5 style={{ marginBottom: '10px' }}>Chat on Kuraute</h5>
              <p style={{ marginBottom: '10px' }}>Join the conversation with your friends and family</p>
              <button
                style={{
                  backgroundColor: 'white',
                  color: 'blue',
                  padding: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  border: '2px solid blue',
                }}
                onClick={() => router.push('/login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;