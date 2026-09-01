import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [rememberMe] = useState(true);

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    const res = await loginWithGoogle(rememberMe);
    setIsGoogleSubmitting(false);

    if (res?.success) {
      showToast('Google Sign-In Successful', 'Authenticated via Firebase & Google OAuth.', 'success');
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
                Finance Business Administration & Loan Ledgers
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Internal management portal for tracking customer loan portfolios, EMI payment receipts, and Firebase database sync.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-base font-extrabold text-white tracking-wide">
              SENTHI KUMAR.M
            </p>
          </div>
        </div>

        {/* Right Side: Google Sign In Portal */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Sign In to Admin Portal</h3>
            <p className="text-xs text-slate-400 mt-1">
              Securely authenticate using your verified Google Account
            </p>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting}
            className="w-full py-3.5 px-5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all hover:border-indigo-500 cursor-pointer"
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
            <span>{isGoogleSubmitting ? 'Authenticating with Google...' : 'Sign in with Google'}</span>
          </motion.button>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              Powered by Firebase Authentication & Google OAuth Security
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
