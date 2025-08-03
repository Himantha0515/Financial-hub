import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, LogIn } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

export const TopBar: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-glass border-b border-light-border dark:border-dark-border px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300"
      >
        {/* Left section - Mobile menu or empty */}
        <div className="flex items-center space-x-6">
          <div className="md:hidden">
            <h1 className="text-lg font-bold text-lime-accent font-editorial">FinanceHub</h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {user ? (
            <>
              {/* Trust indicators */}
              <div className="hidden md:flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 bg-light-glass dark:bg-dark-glass px-3 py-2 rounded-full transition-colors duration-300"
                >
                  <Globe className="w-4 h-4 text-lime-accent" />
                  <span className="text-xs text-light-text dark:text-dark-text">Encrypted</span>
                </motion.div>
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 bg-light-glass dark:bg-dark-glass rounded-full hover:bg-lime-accent/10 transition-colors duration-300"
              >
                <Bell className="w-5 h-5 text-light-text dark:text-dark-text" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-lime-accent rounded-full"
                />
              </motion.button>

              {/* User avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-lime-accent rounded-full flex items-center justify-center cursor-pointer shadow-glow"
              >
                <span className="text-dark-base font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </motion.div>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 bg-lime-accent text-dark-base px-4 py-2 rounded-xl font-medium hover:shadow-glow transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span className="hidden md:inline">Sign In</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};