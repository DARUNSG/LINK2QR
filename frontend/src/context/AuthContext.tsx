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
            // Check local vs session persistence storage only if authenticated locally
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

  // Sync authenticated user record to local Dexie IndexedDB
  const syncLocalUserRecord = async (uid: string, email: string, fullName?: string, avatar?: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName || cleanEmail.split('@')[0] || 'Admin Manager';

    let found = await db.users.where('email').equalsIgnoreCase(cleanEmail).first();
    if (!found) {
      const newUser: User = {
        id: uid || `USR-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: 'Admin',
        avatar: avatar || '',
        phone: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await db.users.add(newUser);
      return newUser;
    }

    await db.users.update(found.id, {
      name: cleanName,
      avatar: avatar || found.avatar,
      lastLogin: new Date().toISOString()
    });
    return { ...found, name: cleanName, avatar: avatar || found.avatar, lastLogin: new Date().toISOString() };
  };

  // Real Email/Password Registration via Firebase Auth
  const signUp = async (
    fullName: string,
    email: string,
    password: string,
    role: UserRole = 'Admin',
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = cred.user;

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName.trim() });
      }

      const activeUser = await syncLocalUserRecord(fbUser.uid, fbUser.email || email, fullName.trim());
      setUser(activeUser);
      saveSessionStorage(activeUser.id, rememberMe);
      await recordUserLoginToFirebase(activeUser);

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('SignUp Error:', err);
      setIsLoading(false);

      let msg = 'Could not create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please Sign In.';
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

  // Real Email/Password Authentication via Firebase Auth
  const login = async (
    email: string,
    role: UserRole = 'Admin',
    password = '',
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!password || password.trim() === '') {
        setIsLoading(false);
        return { success: false, error: 'Please enter your password.' };
      }

      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = cred.user;

      const activeUser = await syncLocalUserRecord(fbUser.uid, fbUser.email || email, fbUser.displayName || undefined);
      setUser(activeUser);
      saveSessionStorage(activeUser.id, rememberMe);
      await recordUserLoginToFirebase(activeUser);

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      setIsLoading(false);

      let msg = 'Invalid email or password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid credentials. Please check your email/password or create a new account.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email format.';
      } else if (err.message) {
        msg = err.message;
      }

      return { success: false, error: msg };
    }
  };

  // Genuine Google OAuth Authentication (Strict Verification - No Dummy Fallbacks)
  const loginWithGoogle = async (rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      // Force Google Account Chooser screen every single time
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

      const activeUser = await syncLocalUserRecord(fbUser.uid, userEmail, userName, userPhoto);
      setUser(activeUser);
      saveSessionStorage(activeUser.id, rememberMe);
      await recordUserLoginToFirebase(activeUser);

      setIsLoading(false);
      return { success: true };
    } catch (popupErr: any) {
      console.error('Google OAuth Error:', popupErr);
      setIsLoading(false);

      let msg = 'Google authentication failed.';
      if (popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
        msg = 'Sign-in cancelled. Account selection window was closed before completing.';
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
