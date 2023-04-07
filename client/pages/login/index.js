import React, { useState } from 'react';
import styles from '../../styles/SignUpForm.module.css'
import api from '../api/config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
    event.preventDefault();
    const data={
      "email":email,
      "password":password
    }
    const res=await api.post('/login',data);

    console.log(res);
    if(res){     
      toast.success('Successfully login', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        localStorage.setItem('token', JSON.stringify(res.data.token));
        const userid=res.data._id;
        router.push(`/profile?userid=${userid}`); 
      }
        else{
          toast.error("Unable to login", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
    setEmail('');
    setPassword('');
  };

  return (
    <>
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Login</h2>
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
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className={styles.formGroup}>
        <button type="submit" className={styles.submitButton}>Login</button>
      </div>
      <div className={styles.formGroup}>
        <a href="#" className={styles.forgotPasswordLink}>Forgot password?</a>
        <span className={styles.separator}>|</span>
        <a href="/signup" className={styles.signUpLink}>Sign up</a>
      </div>
    </form>
    <ToastContainer/>
    </>
  );
}