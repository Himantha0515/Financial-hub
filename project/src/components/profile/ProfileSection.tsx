import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell, LogOut, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ProfileSection: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Profile</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Manage your account and preferences</p>
        </div>
      </motion.div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
      >
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-lime-accent rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-dark-base" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              {user?.email?.split('@')[0] || 'User'}
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">{user?.email}</p>
            <p className="text-lime-accent text-sm font-medium mt-1">Premium Member</p>
          </div>
          <button className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-lime-accent transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Settings Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <Settings className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Account Settings</h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Manage your account preferences</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Security</h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Password and security settings</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <Bell className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Notifications</h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Manage your notification preferences</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleSignOut}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-red-400/30 transition-all hover:shadow-glow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <LogOut className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text group-hover:text-red-400 transition-colors">Sign Out</h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Sign out of your account</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text font-editorial mb-4">App Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">Version</span>
            <span className="text-light-text dark:text-dark-text">2.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">Last Updated</span>
            <span className="text-light-text dark:text-dark-text">January 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">Build</span>
            <span className="text-light-text dark:text-dark-text">Production</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};