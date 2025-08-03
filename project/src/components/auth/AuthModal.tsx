import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onClose();
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error } = await signUp(email, password);
        if (error) throw error;
        setSuccess('Check your email for the confirmation link!');
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setSuccess('Password reset email sent!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
    setShowPassword(false);
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-light-glass dark:hover:bg-dark-glass rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text font-editorial">
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                {mode === 'signin' && 'Sign in to access your finance dashboard'}
                {mode === 'signup' && 'Join FinanceHub to manage your finances'}
                {mode === 'forgot' && 'Enter your email to reset your password'}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-lime-accent/10 border border-lime-accent/20 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-lime-accent" />
                <span className="text-lime-accent text-sm">{success}</span>
              </motion.div>
            )}

            {/* Google Sign In */}
            {mode !== 'forgot' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full mb-6 p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl hover:border-lime-accent/30 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-light-text dark:text-dark-text">Continue with Google</span>
              </motion.button>
            )}

            {/* Divider */}
            {mode !== 'forgot' && (
              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-light-border dark:border-dark-border"></div>
                <span className="px-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">or</span>
                <div className="flex-1 h-px bg-light-border dark:border-dark-border"></div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password for Signup */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text transition-colors"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-lime-accent text-dark-base py-3 rounded-xl font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (
                  mode === 'signin' ? 'Sign In' :
                  mode === 'signup' ? 'Create Account' :
                  'Send Reset Email'
                )}
              </motion.button>
            </form>

            {/* Mode Switching */}
            <div className="mt-6 text-center">
              {mode === 'signin' && (
                <div className="space-y-2">
                  <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchMode('signup')}
                      className="text-lime-accent hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                  <button
                    onClick={() => switchMode('forgot')}
                    className="text-lime-accent hover:underline text-sm"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
              
              {mode === 'signup' && (
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => switchMode('signin')}
                    className="text-lime-accent hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
              
              {mode === 'forgot' && (
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Remember your password?{' '}
                  <button
                    onClick={() => switchMode('signin')}
                    className="text-lime-accent hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};