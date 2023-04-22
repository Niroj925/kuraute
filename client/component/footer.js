import React from 'react';
import style from '../styles/Footer.module.css';

const Footer = () => {

  return (
    <div className={style.footerBox}>
      <footer className={style.footer}>
        <div >
          <p className={style.center}>
            {'© '}
            {new Date().getFullYear()}
            {' All rights reserved by NeoTech.'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
