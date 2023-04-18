import React, { useState } from 'react';
import styles from '../../styles/SignUpForm.module.css'
import api from '../api/api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Navbar from '../../component/navbar.js'
import Footer from '../../component/footer.js'

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
    const res=await api.post('/api/user/login',data);

    console.log(res);
    if(res){     
      toast.success('Successfully login', {
        position: "bottom-right",
        autoClose: 3000,
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
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            setTimeout(() => {
              router.push('/login');
            }, 3000);
        }
    setEmail('');
    setPassword('');
  };

  return (
    <>
    <Navbar/>
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Login</h2>
      <hr/>
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
        <button type="submit" className={styles.submitButton}>Login</button>
      </div>
      <div className={styles.formGroup}>
        {/* <a href="#" className={styles.forgotPasswordLink}>Forgot password?</a> */}
        <Link href="#" className={styles.forgotPasswordLink}>Forgot password?</Link>
        <span className={styles.separator}>|</span>
        {/* <a href="/signup" className={styles.signUpLink}>Sign up</a> */}
        <Link href="/signup" className={styles.signUpLink}>Sign up</Link>
      </div>
    </form>
    <ToastContainer/>
    <Footer/>
    </>
  );
}