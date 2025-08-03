import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';

const mockInvestments = [
  {
    name: 'Equity Mutual Funds',
    value: 285000,
    invested: 250000,
    returns: 35000,
    returnPercent: 14,
    allocation: 45,
    color: 'bg-blue-500'
  },
  {
    name: 'Fixed Deposits',
    value: 150000,
    invested: 150000,
    returns: 0,
    returnPercent: 7.5,
    allocation: 24,
    color: 'bg-lime-accent'
  },
  {
    name: 'Direct Stocks',
    value: 120000,
    invested: 100000,
    returns: 20000,
    returnPercent: 20,
    allocation: 19,
    color: 'bg-purple-500'
  },
  {
    name: 'Gold ETF',
    value: 75000,
    invested: 80000,
    returns: -5000,
    returnPercent: -6.25,
    allocation: 12,
    color: 'bg-yellow-500'
  }
];

export const InvestmentPortfolio: React.FC = () => {
  const totalValue = mockInvestments.reduce((sum, inv) => sum + inv.value, 0);
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalReturns = totalValue - totalInvested;
  const totalReturnPercent = (totalReturns / totalInvested) * 100;

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
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Investment Portfolio</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Your investment overview and performance</p>
        </div>
      </motion.div>

      {/* Portfolio Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-light-surface to-light-glass dark:from-dark-surface dark:to-dark-glass border border-light-border dark:border-dark-border rounded-2xl p-8 shadow-glass relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-accent/5 rounded-full blur-3xl" />
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider">Portfolio Value</p>
            <p className="text-3xl font-bold text-lime-accent font-editorial">{formatCurrency(totalValue)}</p>
          </div>
          <div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider">Total Invested</p>
            <p className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">{formatCurrency(totalInvested)}</p>
          </div>
          <div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider">Total Returns</p>
            <p className={`text-xl font-bold font-editorial flex items-center space-x-1 ${totalReturns >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
              {totalReturns >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span>{formatCurrency(Math.abs(totalReturns))}</span>
            </p>
          </div>
          <div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm uppercase tracking-wider">Return %</p>
            <p className={`text-xl font-bold font-editorial ${totalReturnPercent >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
              {totalReturnPercent > 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">Asset Allocation</h3>
          <div className="space-y-4">
            {mockInvestments.map((investment, index) => (
              <motion.div
                key={investment.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className={`w-4 h-4 rounded-full ${investment.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-light-text dark:text-dark-text font-medium">{investment.name}</span>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm">{investment.allocation}%</span>
                  </div>
                  <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${investment.allocation}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-2 rounded-full ${investment.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">Performance</h3>
          <div className="space-y-4">
            {mockInvestments.map((investment, index) => (
              <motion.div
                key={investment.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-light-glass dark:bg-dark-glass rounded-lg"
              >
                <div>
                  <p className="font-medium text-light-text dark:text-dark-text">{investment.name}</p>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">{formatCurrency(investment.value)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${investment.returns >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
                    {investment.returns >= 0 ? '+' : ''}{formatCurrency(investment.returns)}
                  </p>
                  <p className={`text-sm ${investment.returnPercent >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
                    {investment.returnPercent > 0 ? '+' : ''}{investment.returnPercent}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Investment Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">Investment Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-lime-accent mx-auto mb-3" />
            <h4 className="font-bold text-light-text dark:text-dark-text">Well Diversified</h4>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Your portfolio is spread across multiple asset classes</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-lime-accent mx-auto mb-3" />
            <h4 className="font-bold text-light-text dark:text-dark-text">Good Performance</h4>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Your investments are showing positive returns</p>
          </div>
          <div className="text-center">
            <PieChart className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <h4 className="font-bold text-light-text dark:text-dark-text">Rebalance Soon</h4>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Consider rebalancing your equity allocation</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};