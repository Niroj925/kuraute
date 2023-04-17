import React, { useState } from 'react';
import styles from '../../styles/SignUpForm.module.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../api/config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Grid} from "@mui/material";
import {useRouter, userRouter} from 'next/router';
import Navbar from '../../component/navbar.js';
import Footer from '../../component/footer.js'
import Link from 'next/link';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username,setUsername]=useState(' ');
  const [showPassword, setShowPassword] = useState(false);

   const router=useRouter();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNameChange=(event)=>{
    setUsername(event.target.value)
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    const data={
      "name":username,
      "email":email,
      "password":password
    }
    const res=await api.post('/api/user/register',data);
    console.log(res);
    if(res){
        toast.success('Successfully created Account', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          
          // router.push('/login');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
        else{
          toast.error("Unable to create Account", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            setTimeout(() => {
              router.push('/');
            }, 3000);
        }
    
    setEmail('');
    setPassword('');
    setUsername(' ');
  };

  return (
    <Grid>
      <Navbar/>
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Sign Up</h2>
      <hr/>
      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.formLabel}>Full Name</label>
        <input
          type="text"
          id="username"
          className={styles.formInput}
          value={username}
          onChange={handleNameChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>Email</label>
        <input
          type="email"
          id="email"
          className={styles.formInput}
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.formLabel}>Password</label>
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={styles.formInput}
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className={styles.showPasswordButton}
            onClick={handleShowPassword}
          >
             {showPassword ? <FaEyeSlash className={styles.showPasswordButton}/> : <FaEye className={styles.showPasswordButton}/>}
          </button>
        </div>
      </div>
      <div className={styles.formGroup}>
        <button type="submit" className={styles.submitButton}>Sign Up</button>
      </div>
      <div className={styles.formGroup}>
        {/* <a href="#" className={styles.forgotPasswordLink}>Forgot password?</a> */}
        <Link href="#" className={styles.forgotPasswordLink}>Forgot password?</Link>
        <span className={styles.separator}>|</span>
        {/* <a href="/login" className={styles.signUpLink}>Sign In</a> */}
        <Link href="/login" className={styles.signUpLink}>Sign In</Link>
      </div>
    </form>
    <ToastContainer/>
    <Footer/>
    </Grid>
  );
}