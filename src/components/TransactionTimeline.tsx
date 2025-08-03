import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Coffee, Car, Home, Plus } from 'lucide-react';

// Updated with Indian transactions and INR currency
const transactions = [
  {
    id: 1,
    type: 'expense',
    amount: -25000,
    currency: 'INR',
    recipient: 'Rent Payment',
    location: 'Mumbai, India',
    category: 'Housing',
    icon: Home,
    time: '2 hours ago',
    description: 'Monthly apartment rent'
  },
  {
    id: 2,
    type: 'income',
    amount: +75000,
    currency: 'INR',
    recipient: 'Salary Credit',
    location: 'Bangalore, India',
    category: 'Income',
    icon: ArrowDownLeft,
    time: '5 hours ago',
    description: 'Monthly salary deposit'
  },
  {
    id: 3,
    type: 'expense',
    amount: -8500,
    currency: 'INR',
    recipient: 'Uber',
    location: 'Delhi, India',
    category: 'Transportation',
    icon: Car,
    time: '1 day ago',
    description: 'Cab rides this week'
  },
  {
    id: 4,
    type: 'expense',
    amount: -3200,
    currency: 'INR',
    recipient: 'BigBasket',
    location: 'Chennai, India',
    category: 'Groceries',
    icon: ShoppingBag,
    time: '2 days ago',
    description: 'Weekly grocery shopping'
  },
  {
    id: 5,
    type: 'expense',
    amount: -450,
    currency: 'INR',
    recipient: 'Starbucks Coffee',
    location: 'Pune, India',
    category: 'Food',
    icon: Coffee,
    time: '3 days ago',
    description: 'Coffee & snacks'
  },
];

const categoryColors = {
  Housing: 'bg-blue-500/20 text-blue-400',
  Income: 'bg-lime-accent/20 text-lime-accent',
  Transportation: 'bg-purple-500/20 text-purple-400',
  Groceries: 'bg-orange-500/20 text-orange-400',
  Food: 'bg-pink-500/20 text-pink-400',
};

export const TransactionTimeline: React.FC = () => {
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
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Recent Activity</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Your latest transactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-lime-accent text-dark-base px-4 py-2 rounded-xl font-medium hover:shadow-glow transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Add Transaction</span>
        </motion.button>
      </motion.div>

      {/* Transaction List */}
      <div className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6 shadow-glass transition-colors duration-300">
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 5 }}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-light-glass dark:hover:bg-dark-glass transition-all group relative duration-300"
            >
              {/* Transaction Icon */}
              <div className={`p-3 rounded-full ${transaction.amount < 0 ? 'bg-red-500/20' : 'bg-lime-accent/20'}`}>
                <transaction.icon className={`w-5 h-5 ${transaction.amount < 0 ? 'text-red-400' : 'text-lime-accent'}`} />
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-light-text dark:text-dark-text font-editorial truncate">{transaction.recipient}</p>
                  <span className="text-lg">🇮🇳</span>
                </div>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{transaction.location}</p>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[transaction.category as keyof typeof categoryColors]}`}>
                    {transaction.category}
                  </span>
                </div>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">{transaction.description}</p>
              </div>

              {/* Amount and Time */}
              <div className="text-right">
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className={`font-bold font-editorial text-lg ${
                    transaction.amount > 0 ? 'text-lime-accent' : 'text-light-text dark:text-dark-text'
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </motion.p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">{transaction.time}</p>
              </div>

              {/* Hover effect line */}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="absolute bottom-0 left-0 h-px bg-lime-accent/30"
              />
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text hover:border-lime-accent/30 hover:text-lime-accent transition-all font-medium duration-300"
        >
          View All Transactions
        </motion.button>
      </div>
    </div>
  );
};