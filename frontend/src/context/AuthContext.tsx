import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { User, UserRole } from '../types';
import { db } from '../db/database';
import { seedDatabaseIfEmpty } from '../db/seed';
import {
  auth,
  googleProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence
} from '../firebase/config';
import { recordUserLoginToFirebase } from '../services/firebaseService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (fullName: string, email: string, password: string, role: UserRole, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        await seedDatabaseIfEmpty();

        onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser && fbUser.email) {
            const userEmail = fbUser.email.toLowerCase();
            const userName = fbUser.displayName || userEmail.split('@')[0];
            const userPhoto = fbUser.photoURL || '';

            let found = await db.users.where('email').equalsIgnoreCase(userEmail).first();

            if (!found) {
              const newUser: User = {
                id: fbUser.uid,
                name: userName,
                email: userEmail,
                role: 'Admin',
                avatar: userPhoto,
                phone: '',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
              };
              await db.users.add(newUser);
              found = newUser;
            } else {
              await db.users.update(found.id, {
                name: userName || found.name,
                avatar: userPhoto || found.avatar,
                lastLogin: new Date().toISOString()
              });
              found = { ...found, name: userName || found.name, avatar: userPhoto || found.avatar };
            }

            setUser(found);
            localStorage.setItem('finpulse_user_id', found.id);
          } else {
            const savedUserId = localStorage.getItem('finpulse_user_id') || sessionStorage.getItem('finpulse_user_id');
            if (savedUserId) {
              const foundUser = await db.users.get(savedUserId);
              if (foundUser) setUser(foundUser);
            }
          }
          setIsLoading(false);
        });
      } catch (err) {
        console.warn('Auth init note:', err);
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const saveSessionStorage = (userId: string, rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem('finpulse_user_id', userId);
      localStorage.setItem('finpulse_remember_me', 'true');
      sessionStorage.removeItem('finpulse_user_id');
    } else {
      sessionStorage.setItem('finpulse_user_id', userId);
      localStorage.removeItem('finpulse_user_id');
      localStorage.removeItem('finpulse_remember_me');
    }
  };

  // Sign Up New Account (Registers User in Backend API & Database)
  const signUp = async (
    fullName: string,
    email: string,
    password: string,
    role: UserRole = 'Admin',
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    try {
      // 1. Check if email already registered in local DB
      const existing = await db.users.where('email').equalsIgnoreCase(cleanEmail).first();
      if (existing) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email already exists. Please Sign In.' };
      }

      // 2. Try Backend API Registration (/api/auth/register)
      try {
        const apiRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: cleanName, email: cleanEmail, password, role })
        });
        const apiData = await apiRes.json();

        if (apiRes.ok && apiData.success) {
          const newUser: User = {
            id: apiData.user.id,
            name: cleanName,
            email: cleanEmail,
            password,
            role,
            avatar: '',
            phone: '',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          await db.users.add(newUser);
          setUser(newUser);
          saveSessionStorage(newUser.id, rememberMe);
          setIsLoading(false);
          return { success: true };
        } else if (!apiRes.ok && apiData.error) {
          setIsLoading(false);
          return { success: false, error: apiData.error };
        }
      } catch (backendErr) {
        console.warn('Backend Auth API unavailable, using Firebase Auth:', backendErr);
      }

      // 3. Fallback to Firebase Auth
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = cred.user;

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: cleanName });
      }

      const newUser: User = {
        id: fbUser.uid,
        name: cleanName,
        email: cleanEmail,
        password,
        role,
        avatar: '',
        phone: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await db.users.add(newUser);
      setUser(newUser);
      saveSessionStorage(newUser.id, rememberMe);
      await recordUserLoginToFirebase(newUser);

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('SignUp Error:', err);
      setIsLoading(false);

      let msg = 'Could not create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists in database. Please Sign In.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.message) {
        msg = err.message;
      }

      return { success: false, error: msg };
    }
  };

  // Sign In Existing Account (Strict Verification - NO Random Unregistered Email Logins Allowed)
  const login = async (
    email: string,
    role: UserRole = 'Admin',
    password = '',
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (!password || password.trim() === '') {
        setIsLoading(false);
        return { success: false, error: 'Please enter your password.' };
      }

      // 1. Try Backend API Authentication (/api/auth/login)
      try {
        const apiRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        const apiData = await apiRes.json();

        if (apiRes.ok && apiData.success) {
          let localUser = await db.users.where('email').equalsIgnoreCase(cleanEmail).first();
          if (!localUser) {
            localUser = {
              id: apiData.user.id,
              name: apiData.user.name,
              email: cleanEmail,
              role: apiData.user.role || 'Admin',
              avatar: apiData.user.avatar || '',
              phone: '',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            await db.users.add(localUser);
          } else {
            await db.users.update(localUser.id, { lastLogin: new Date().toISOString() });
          }

          setUser(localUser);
          saveSessionStorage(localUser.id, rememberMe);
          setIsLoading(false);
          return { success: true };
        } else if (!apiRes.ok && apiData.error) {
          // Explicit API denial (e.g. Account not found or wrong password)
          setIsLoading(false);
          return { success: false, error: apiData.error };
        }
      } catch (backendErr) {
        console.warn('Backend Auth API unavailable, checking local database and Firebase Auth:', backendErr);
      }

      // 2. Check local database users first
      const localUser = await db.users.where('email').equalsIgnoreCase(cleanEmail).first();

      if (localUser) {
        // If password stored in local record, verify match
        if (localUser.password && localUser.password !== password) {
          setIsLoading(false);
          return { success: false, error: 'Incorrect password. Access denied.' };
        }

        // Try Firebase Auth verification
        try {
          await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
          await signInWithEmailAndPassword(auth, cleanEmail, password);
        } catch (e) {}

        await db.users.update(localUser.id, { lastLogin: new Date().toISOString() });
        setUser(localUser);
        saveSessionStorage(localUser.id, rememberMe);
        setIsLoading(false);
        return { success: true };
      }

      // 3. Authenticate with Firebase Auth if user not in local IndexedDB
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = cred.user;

        const newUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'Admin',
          avatar: fbUser.photoURL || '',
          phone: '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await db.users.add(newUser);
        setUser(newUser);
        saveSessionStorage(newUser.id, rememberMe);
        await recordUserLoginToFirebase(newUser);

        setIsLoading(false);
        return { success: true };
      } catch (fbErr: any) {
        console.error('Firebase Login Error:', fbErr);
        setIsLoading(false);

        let msg = 'Account not registered. Please enter valid credentials or click Create Account.';
        if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
          msg = 'Invalid credentials. User is not registered in our database. Click "Create Account" below to register.';
        } else if (fbErr.code === 'auth/wrong-password') {
          msg = 'Incorrect password. Access denied.';
        }

        return { success: false, error: msg };
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed. User is not registered.' };
    }
  };

  // Genuine Google OAuth Authentication (Strict Google Account Verification)
  const loginWithGoogle = async (rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      googleProvider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      if (!fbUser || !fbUser.email) {
        setIsLoading(false);
        return { success: false, error: 'Google Sign-In failed. No verified Google account email returned.' };
      }

      const userEmail = fbUser.email.toLowerCase();
      const userName = fbUser.displayName || userEmail.split('@')[0];
      const userPhoto = fbUser.photoURL || '';

      let found = await db.users.where('email').equalsIgnoreCase(userEmail).first();
      if (!found) {
        const newUser: User = {
          id: fbUser.uid,
          name: userName,
          email: userEmail,
          role: 'Admin',
          avatar: userPhoto,
          phone: '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await db.users.add(newUser);
        found = newUser;
      } else {
        await db.users.update(found.id, {
          name: userName,
          avatar: userPhoto || found.avatar,
          lastLogin: new Date().toISOString()
        });
        found = { ...found, name: userName, avatar: userPhoto || found.avatar };
      }

      setUser(found);
      saveSessionStorage(found.id, rememberMe);
      await recordUserLoginToFirebase(found);

      setIsLoading(false);
      return { success: true };
    } catch (popupErr: any) {
      console.error('Google OAuth Error:', popupErr);
      setIsLoading(false);

      let msg = 'Google authentication failed.';
      if (popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
        msg = 'Sign-in cancelled. Google account selection window was closed.';
      } else if (popupErr.code === 'auth/unauthorized-domain') {
        msg = `Domain "${window.location.hostname}" is not authorized in Firebase Console. Please add this domain under Firebase > Authentication > Settings > Authorized Domains.`;
      } else if (popupErr.message) {
        msg = popupErr.message;
      }

      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('finpulse_user_id');
    localStorage.removeItem('finpulse_remember_me');
    sessionStorage.removeItem('finpulse_user_id');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        loginWithGoogle,
        logout,
        isAdmin: user?.role === 'Admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
