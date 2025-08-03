import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3 } from 'lucide-react';

interface StockIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
}

const mockIndices: StockIndex[] = [
  {
    name: 'NIFTY 50',
    symbol: 'NIFTY',
    value: 21854.05,
    change: 234.80,
    changePercent: 1.09,
    high: 21889.25,
    low: 21654.30,
    volume: '₹45,234 Cr'
  },
  {
    name: 'SENSEX',
    symbol: 'BSE',
    value: 72186.94,
    change: 445.87,
    changePercent: 0.62,
    high: 72298.12,
    low: 71856.33,
    volume: '₹38,567 Cr'
  },
  {
    name: 'NASDAQ',
    symbol: 'NASDAQ',
    value: 15467.87,
    change: -89.23,
    changePercent: -0.57,
    high: 15587.45,
    low: 15423.12,
    volume: '$234.5B'
  },
  {
    name: 'S&P 500',
    symbol: 'SPX',
    value: 4756.23,
    change: 12.45,
    changePercent: 0.26,
    high: 4768.89,
    low: 4734.56,
    volume: '$187.3B'
  }
];

const topStocks = [
  { symbol: 'RELIANCE', price: 2847.65, change: 1.23, volume: '2.3M' },
  { symbol: 'TCS', price: 3456.80, change: -0.87, volume: '1.8M' },
  { symbol: 'HDFC BANK', price: 1687.45, change: 2.14, volume: '4.1M' },
  { symbol: 'INFY', price: 1534.20, change: 0.95, volume: '3.2M' },
  { symbol: 'ITC', price: 456.75, change: -1.25, volume: '5.7M' },
];

export const StockMarketDashboard: React.FC = () => {
  const [indices, setIndices] = useState<StockIndex[]>(mockIndices);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = () => {
    // Simulate real-time updates
    setIndices(prev => prev.map(index => ({
      ...index,
      value: index.value + (Math.random() - 0.5) * 50,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 2,
    })));
    setLastUpdate(new Date());
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Market Dashboard</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Live market data and indices</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshData}
          className="p-3 bg-light-glass dark:bg-dark-glass rounded-full hover:bg-lime-accent/10 transition-colors duration-300"
        >
          <RefreshCw className="w-5 h-5 text-light-text dark:text-dark-text" />
        </motion.button>
      </motion.div>

      {/* Market Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-light-surface/80 to-light-glass dark:from-dark-surface/80 dark:to-dark-glass border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text font-editorial">Market Status</h3>
            <p className="text-lime-accent font-medium">Markets are Open</p>
          </div>
          <div className="text-right">
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Last updated</p>
            <p className="text-light-text dark:text-dark-text font-medium">{lastUpdate.toLocaleTimeString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Indices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {indices.map((index, i) => (
          <motion.div
            key={index.symbol}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">{index.name}</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">{index.symbol}</p>
              </div>
              <div className={`flex items-center space-x-1 ${index.change >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
                {index.change >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="font-medium">{index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
                  {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
                <span className={`text-sm font-medium ${index.change >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
                  {index.change > 0 ? '+' : ''}{index.change.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary block">High</span>
                  <span className="text-light-text dark:text-dark-text font-medium">{index.high.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary block">Low</span>
                  <span className="text-light-text dark:text-dark-text font-medium">{index.low.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary block">Volume</span>
                  <span className="text-light-text dark:text-dark-text font-medium">{index.volume}</span>
                </div>
              </div>

              <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((index.value - index.low) / (index.high - index.low)) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                  className="h-1 bg-lime-accent rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Stocks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">Top Movers</h3>
        <div className="space-y-4">
          {topStocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-light-glass dark:hover:bg-dark-glass transition-colors"
            >
              <div>
                <h4 className="font-medium text-light-text dark:text-dark-text">{stock.symbol}</h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Vol: {stock.volume}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-light-text dark:text-dark-text">₹{stock.price.toFixed(2)}</p>
                <p className={`text-sm ${stock.change >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
                  {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};