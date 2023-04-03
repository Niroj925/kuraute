import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarMenu}>
        <li className={styles.navbarItem}>
          <Link href="/">
            {/* <a className={styles.navbarLink}>Home</a> */}
            Home
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="/about">
            {/* <a className={styles.navbarLink}>About</a> */}
            About
          </Link>
        </li>
      </ul>
      <div className={styles.navbarButtons}>
        <Link href='/login' className={styles.loginButton}>
            Login
          </Link>
          <Link href='/signup' className={styles.signupButton}>
            Sign Up
          </Link>
      </div>
    </nav>
  );
}