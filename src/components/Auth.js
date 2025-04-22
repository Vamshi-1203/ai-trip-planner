import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import "./Auth.css";

function Auth() {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();
  let inactivityTimer;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        startInactivityTimer();
        localStorage.setItem("authUser", "true");
      } else {
        localStorage.removeItem("authUser");
      }
    });

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("scroll", resetInactivityTimer);

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      unsubscribe();
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
      window.removeEventListener("beforeunload", handleTabClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      handleSignOut();
    }, 900000);
  };

  const resetInactivityTimer = () => {
    if (user) {
      clearTimeout(inactivityTimer);
      startInactivityTimer();
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleTabClose = async () => {
    if (user) {
      await signOut(auth);
    }
  };

  return (
    <div className="auth-container">
      {!user ? (
        <button onClick={handleSignIn} className="google-signin-button">
          <FcGoogle className="google-icon" />
          <span>Sign in with Google</span>
        </button>
      ) : (
        <button onClick={handleSignOut} className="signout-button">
          Sign Out
        </button>
      )}
    </div>
  );
}

export default Auth;
