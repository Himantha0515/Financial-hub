import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, EyeOff, Wallet } from 'lucide-react';

// Updated to show INR balances and Indian bank accounts
const currencies = [
  { code: 'Savings', symbol: '₹', balance: 284732, change: +2.34, bank: 'HDFC Bank', type: 'Savings Account' },
  { code: 'Current', symbol: '₹', balance: 156890, change: -1.12, bank: 'ICICI Bank', type: 'Current Account' },
  { code: 'FD', symbol: '₹', balance: 500000, change: +0.89, bank: 'SBI', type: 'Fixed Deposit' },
  { code: 'Wallet', symbol: '₹', balance: 12500, change: -0.45, bank: 'PayTM', type: 'Digital Wallet' },
];

export const WalletOverview: React.FC = () => {
  const [showBalances, setShowBalances] = React.useState(true);
  const totalBalance = currencies.reduce((sum, currency) => sum + currency.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Portfolio Overview</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Your financial accounts in India</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBalances(!showBalances)}
          className="p-3 bg-light-glass dark:bg-dark-glass rounded-full hover:bg-lime-accent/10 transition-colors duration-300"
        >
          {showBalances ? (
            <Eye className="w-5 h-5 text-light-text dark:text-dark-text" />
          ) : (
            <EyeOff className="w-5 h-5 text-light-text dark:text-dark-text" />
          )}
        </motion.button>
      </motion.div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-light-surface to-light-glass dark:from-dark-surface dark:to-dark-glass border border-light-border dark:border-dark-border rounded-2xl p-8 shadow-glass relative overflow-hidden transition-colors duration-300"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-accent/5 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider">Total Portfolio Value</p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
            className="flex items-baseline space-x-2 mt-2"
          >
            <span className="text-4xl font-bold text-lime-accent font-editorial">
              {showBalances ? formatCurrency(totalBalance) : '₹ ••••••••'}
            </span>
            <span className="text-lg text-light-text-secondary dark:text-dark-text-secondary">INR</span>
          </motion.div>
          <div className="flex items-center space-x-2 mt-3">
            <TrendingUp className="w-4 h-4 text-lime-accent" />
            <span className="text-lime-accent text-sm">+4.2% this month</span>
          </div>
        </div>
      </motion.div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currencies.map((account, index) => (
          <motion.div
            key={account.code}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow group duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Wallet className="w-6 h-6 text-lime-accent" />
                <div>
                  <h3 className="font-bold text-light-text dark:text-dark-text font-editorial">{account.code}</h3>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{account.type}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${account.change >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
                {account.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm">{account.change > 0 ? '+' : ''}{account.change}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="text-2xl font-bold text-light-text dark:text-dark-text font-editorial"
              >
                {showBalances ? formatCurrency(account.balance) : '₹ ••••••'}
              </motion.p>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{account.bank}</p>
              <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(account.balance / 500000 * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                  className="h-1 bg-lime-accent rounded-full opacity-70"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};