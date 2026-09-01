import React, { useState } from 'react';
import { Wallet, ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Building2, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const { login, signUp, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const toggleMode = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Validation Error', 'Please enter your email and password.', 'warning');
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        showToast('Validation Error', 'Please enter your Full Name.', 'warning');
        return;
      }
      if (password.length < 6) {
        showToast('Weak Password', 'Password must be at least 6 characters long.', 'warning');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Password Mismatch', 'Password and Confirm Password do not match.', 'error');
        return;
      }

      setIsSubmitting(true);
      const { success, error } = await signUp(fullName, email, password, 'Admin', rememberMe);
      setIsSubmitting(false);

      if (success) {
        showToast('Account Created Successfully!', `Welcome ${fullName}. Registered as Admin in Firebase.`, 'success');
      } else {
        showToast('Sign Up Error', error || 'Failed to create account.', 'error');
      }
    } else {
      setIsSubmitting(true);
      const { success, error } = await login(email, 'Admin', password, rememberMe);
      setIsSubmitting(false);

      if (success) {
        showToast('Welcome to FinPulse Admin Portal', 'Signed in successfully as Business Admin.', 'success');
      } else {
        showToast('Authentication Failed', error || 'Please check your credentials.', 'error');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    const res = await loginWithGoogle(rememberMe);
    setIsGoogleSubmitting(false);

    if (res?.success) {
      showToast('Google Sign-In Successful', 'Authenticated via Google OAuth.', 'success');
    } else if (res?.error) {
      showToast('Authentication Failed', res.error, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light glows */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-2xl shadow-2xl overflow-hidden relative z-10 my-6"
      >
        {/* Left Side: Business Admin Engine Overview */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 flex flex-col justify-between border-r border-slate-800/80">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Matrix Finance Logo"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/30 shrink-0"
              />
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
                  Matrix Finance
                </span>
                <p className="text-[11px] text-indigo-400 font-bold tracking-wider uppercase mt-1">
                  Internal Admin System
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-5">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold text-xs rounded-full border border-indigo-500/30 inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Business Admin Portal Only
              </span>
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                {isSignUp ? 'Create Business Admin Account' : 'Finance Business Administration & Loan Ledgers'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {isSignUp
                  ? 'Register your business admin account. Account details will be created in Firebase Auth and Realtime Database.'
                  : 'Internal management portal for tracking customer loan portfolios, EMI payment receipts, and Firebase database sync.'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-base font-extrabold text-white tracking-wide">
              SENTHI KUMAR.M
            </p>
          </div>
        </div>

        {/* Right Side: Login / Sign Up Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">
              {isSignUp ? 'Create Admin Account' : 'Sign In as Admin'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp ? 'Fill in your details below to register' : 'Enter your admin credentials or sign in with Google'}
            </p>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all mb-4 hover:border-slate-600 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleSubmitting ? 'Signing in...' : isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </motion.button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-slate-800" />
            <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider absolute">
              Or {isSignUp ? 'Sign Up With Email' : 'Work Email'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name field (Sign Up Mode Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={isSignUp}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Rajesh Sharma"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="admin@myfinance.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password (Sign Up Mode Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required={isSignUp}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>Keep session active</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Admin Support', 'Use your email or Sign in with Google above.', 'info');
                  }}
                  className="text-indigo-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
            >
              <span>
                {isSubmitting
                  ? isSignUp
                    ? 'Creating Admin Account...'
                    : 'Authenticating...'
                  : isSignUp
                  ? 'Create Admin Account & Sign In'
                  : 'Sign In as Admin'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-5 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            {isSignUp ? (
              <p>
                Already have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode(false)}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode(true)}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold ml-1 cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
