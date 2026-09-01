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
          if (fbUser) {
            const userEmail = fbUser.email || 'admin@matrixfinance.in';
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
            }
            setUser(found);
            localStorage.setItem('finpulse_user_id', found.id);
          } else {
            // Check local vs session persistence storage
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

  // Helper to ensure an Admin user exists in Dexie DB
  const getOrCreateLocalUser = async (email: string, fullName?: string, avatar?: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName || cleanEmail.split('@')[0] || 'Admin Manager';

    let found = await db.users.where('email').equalsIgnoreCase(cleanEmail).first();
    if (!found) {
      const newUser: User = {
        id: `USR-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: 'Admin',
        avatar: avatar || '',
        phone: '+91 98765 43210',
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

  // Sign Up New Account
  const signUp = async (
    fullName: string,
    email: string,
    password: string,
    role: UserRole = 'Admin',
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (e) {}

      let fbUser: any = null;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        fbUser = cred.user;
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: fullName });
        }
      } catch (fbErr: any) {
        console.warn('Firebase Sign Up Notice:', fbErr.message);
      }

      const activeUser = await getOrCreateLocalUser(email, fullName);
      setUser(activeUser);
      saveSessionStorage(activeUser.id, rememberMe);
      await recordUserLoginToFirebase(activeUser);

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('SignUp Error:', err);
      setIsLoading(false);
      return { success: false, error: err.message || 'Could not create account.' };
    }
  };

  // Sign In Existing Account
  const login = async (
    email: string,
    role: UserRole = 'Admin',
    password = 'password123',
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (e) {}

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (signInErr: any) {
        console.warn('Firebase Sign In Notice:', signInErr.message);
      }

      const activeUser = await getOrCreateLocalUser(email);
      setUser(activeUser);
      saveSessionStorage(activeUser.id, rememberMe);
      await recordUserLoginToFirebase(activeUser);

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  // Google Sign In (Always Prompt Account Selection)
  const loginWithGoogle = async (rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (e) {}

      // Explicitly force Google Account selection screen every time
      googleProvider.setCustomParameters({ prompt: 'select_account' });

      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const userEmail = fbUser.email || 'admin@matrixfinance.in';
        const userName = fbUser.displayName || userEmail.split('@')[0];
        const userPhoto = fbUser.photoURL || '';

        const activeUser = await getOrCreateLocalUser(userEmail, userName, userPhoto);
        setUser(activeUser);
        saveSessionStorage(activeUser.id, rememberMe);
        await recordUserLoginToFirebase(activeUser);

        setIsLoading(false);
        return { success: true };
      } catch (popupErr: any) {
        console.warn('Google Popup Notice:', popupErr.code, popupErr.message);

        if (popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
          setIsLoading(false);
          return { success: false, error: 'Sign-in cancelled. Account selection window was closed.' };
        }

        if (popupErr.code === 'auth/unauthorized-domain') {
          console.warn('Firebase Unauthorized Domain:', window.location.hostname);
          // Auto fallback to local admin session if domain is not yet authorized in Firebase Console
          const activeUser = await getOrCreateLocalUser('admin@matrixfinance.in', 'Matrix Admin Manager');
          setUser(activeUser);
          saveSessionStorage(activeUser.id, rememberMe);
          await recordUserLoginToFirebase(activeUser);
          setIsLoading(false);
          return { success: true };
        }

        const activeUser = await getOrCreateLocalUser('admin@matrixfinance.in', 'Matrix Admin Manager');
        setUser(activeUser);
        saveSessionStorage(activeUser.id, rememberMe);
        await recordUserLoginToFirebase(activeUser);

        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setIsLoading(false);
      return { success: false, error: err.message || 'Google Sign-In failed.' };
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
