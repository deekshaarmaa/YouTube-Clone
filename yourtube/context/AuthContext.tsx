// yourtube/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { auth, googleProvider } from '../firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth';

// ✅ Extended SafeUser to support both name & displayName
type SafeUser = { 
  uid: string; 
  name: string | null;       // human-readable name we set
  email: string | null; 
  displayName?: string | null; // firebase native property
};

type AuthContextType = {
  user: SafeUser | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!isMounted.current) return;

      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,      // fallback
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        });
        localStorage.setItem('yt_user', JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        localStorage.removeItem('yt_user');
      }
      setLoading(false);
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (isMounted.current && cred.user) {
        await updateProfile(cred.user, { displayName: name });
        setUser({ 
          uid: cred.user.uid, 
          name, 
          displayName: name, 
          email: cred.user.email 
        });
      }
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (isMounted.current && cred.user) {
        setUser({ 
          uid: cred.user.uid, 
          name: cred.user.displayName, 
          displayName: cred.user.displayName,
          email: cred.user.email 
        });
      }
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (isMounted.current && cred.user) {
        setUser({ 
          uid: cred.user.uid, 
          name: cred.user.displayName, 
          displayName: cred.user.displayName,
          email: cred.user.email 
        });
      }
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    localStorage.removeItem('yt_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const v = useContext(AuthContext);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
};
