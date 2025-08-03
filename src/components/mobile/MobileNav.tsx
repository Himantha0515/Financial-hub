import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Target, Calendar, PieChart, User } from 'lucide-react';

interface MobileNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'stocks', label: 'Stocks', icon: TrendingUp },
  { id: 'savings', label: 'Savings', icon: Target },
  { id: 'emi', label: 'EMI', icon: Calendar },
  { id: 'budget', label: 'Budget', icon: PieChart },
  { id: 'profile', label: 'Profile', icon: User },
];

export const MobileNav: React.FC<MobileNavProps> = ({ activeSection, onSectionChange }) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-glass border-t border-light-border dark:border-dark-border z-50 md:hidden"
    >
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-colors ${
              activeSection === item.id
                ? 'text-lime-accent'
                : 'text-light-text-secondary dark:text-dark-text-secondary'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {activeSection === item.id && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-lime-accent rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};