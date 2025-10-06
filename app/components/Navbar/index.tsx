// components/Navbar/index.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import styles from './navbar.module.css';

import { MdHome, MdAddCircle, MdLogout, MdLogin } from 'react-icons/md';


export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link
          href="/"
          className={styles.navbarLogo}
        >
          FINANCEIRO
        </Link>

        <div className={styles.navbarLinks}>
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className={styles.navLink}
              >
                <MdHome size={24} />
                Lançamentos
              </Link>
              
              <Link href="/cadastrar" className={styles.navLink}>
                <MdAddCircle size={24} />
                Cadastrar 
              </Link>

              <button
                onClick={logout}
                className={styles.navButton}
              >
                <MdLogout size={24} />
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={styles.navButton}
            >
              <MdLogin size={24} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};