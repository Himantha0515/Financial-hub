import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  Target, 
  Calendar, 
  PieChart, 
  Briefcase, 
  Newspaper, 
  User,
  ChevronLeft, 
  ChevronRight,
  Calculator
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'fd', label: 'Fixed Deposits', icon: Calculator },
  { id: 'stocks', label: 'Stock Market', icon: TrendingUp },
  { id: 'savings', label: 'Savings Goals', icon: Target },
  { id: 'emi', label: 'EMI Reminders', icon: Calendar },
  { id: 'budget', label: 'Budget Planner', icon: PieChart },
  { id: 'investments', label: 'Investments', icon: Briefcase },
  { id: 'news', label: 'News & Tips', icon: Newspaper },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-glass border-r border-light-border dark:border-dark-border flex flex-col h-full transition-colors duration-300"
    >
      {/* Header */}
      <div className="p-6 border-b border-light-border dark:border-dark-border flex items-center justify-between">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-lime-accent font-editorial">FinanceHub</h1>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Personal Finance</p>
            </div>
          )}
        </motion.div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-light-glass dark:hover:bg-dark-glass transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all relative group ${
              activeSection === item.id
                ? 'bg-lime-accent/10 text-lime-accent'
                : 'text-light-text dark:text-dark-text hover:bg-light-glass dark:hover:bg-dark-glass hover:text-lime-accent'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`relative ${activeSection === item.id ? 'drop-shadow-glow' : ''}`}>
              <item.icon className="w-6 h-6" />
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-lime-accent/20 rounded-full blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="font-medium font-editorial"
              >
                {item.label}
              </motion.span>
            )}
            {activeSection === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute right-0 w-1 h-8 bg-lime-accent rounded-l-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Footer - User Info */}
      <div className="p-4 border-t border-light-border dark:border-dark-border">
        <div className="flex items-center space-x-3 p-3 bg-light-glass dark:bg-dark-glass rounded-xl">
          <div className="w-8 h-8 bg-lime-accent rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-dark-base" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium text-light-text dark:text-dark-text">Premium User</p>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">All features unlocked</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};