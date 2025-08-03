import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, ExternalLink, Bookmark } from 'lucide-react';

const newsArticles = [
  {
    id: 1,
    title: 'RBI Keeps Repo Rate Unchanged at 6.5%',
    summary: 'Reserve Bank of India maintains status quo on interest rates, citing inflation concerns and global economic uncertainty.',
    category: 'Monetary Policy',
    readTime: '3 min read',
    publishedAt: '2 hours ago',
    imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
    source: 'Financial Times India'
  },
  {
    id: 2,
    title: 'Nifty 50 Hits New All-Time High',
    summary: 'Indian stock markets surge to record levels on strong corporate earnings and positive investor sentiment.',
    category: 'Stock Market',
    readTime: '2 min read',
    publishedAt: '4 hours ago',
    imageUrl: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=400',
    source: 'Economic Times'
  },
  {
    id: 3,
    title: 'New Tax Rules for Crypto Investments',
    summary: 'Government announces updated taxation framework for cryptocurrency investments and trading activities.',
    category: 'Taxation',
    readTime: '5 min read',
    publishedAt: '6 hours ago',
    imageUrl: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400',
    source: 'Business Standard'
  },
  {
    id: 4,
    title: 'SIP Investments Reach Record Highs',
    summary: 'Systematic Investment Plans see unprecedented inflows as retail investors embrace systematic investing.',
    category: 'Mutual Funds',
    readTime: '4 min read',
    publishedAt: '8 hours ago',
    imageUrl: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=400',
    source: 'Money Control'
  },
  {
    id: 5,
    title: 'Digital Banking Revolution in India',
    summary: 'How fintech innovations are transforming the Indian banking landscape and customer experience.',
    category: 'Fintech',
    readTime: '6 min read',
    publishedAt: '1 day ago',
    imageUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400',
    source: 'Tech Financial'
  },
  {
    id: 6,
    title: 'Personal Finance Tips for Young Professionals',
    summary: 'Essential money management strategies for professionals starting their career in 2024.',
    category: 'Personal Finance',
    readTime: '7 min read',
    publishedAt: '1 day ago',
    imageUrl: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=400',
    source: 'Finance Guru'
  }
];

const financeTips = [
  {
    tip: 'Start investing early to benefit from compound interest',
    category: 'Investment'
  },
  {
    tip: 'Maintain an emergency fund worth 6-12 months of expenses',
    category: 'Savings'
  },
  {
    tip: 'Diversify your portfolio across different asset classes',
    category: 'Portfolio'
  },
  {
    tip: 'Review and rebalance your investments annually',
    category: 'Planning'
  }
];

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Monetary Policy': 'bg-blue-500/20 text-blue-400',
    'Stock Market': 'bg-lime-accent/20 text-lime-accent',
    'Taxation': 'bg-red-500/20 text-red-400',
    'Mutual Funds': 'bg-purple-500/20 text-purple-400',
    'Fintech': 'bg-orange-500/20 text-orange-400',
    'Personal Finance': 'bg-pink-500/20 text-pink-400',
  };
  return colors[category] || 'bg-gray-500/20 text-gray-400';
};

export const FinanceNews: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Finance News & Tips</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Stay updated with latest financial news and insights</p>
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-lime-accent/10 to-lime-accent/5 border border-lime-accent/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text font-editorial mb-4">💡 Quick Finance Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {financeTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="w-2 h-2 bg-lime-accent rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-light-text dark:text-dark-text text-sm">{tip.tip}</p>
                <span className="text-lime-accent text-xs font-medium">{tip.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {newsArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl overflow-hidden hover:border-lime-accent/30 transition-all hover:shadow-glow group cursor-pointer"
          >
            {/* Article Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
            </div>

            {/* Article Content */}
            <div className="p-6">
              <h3 className="font-bold text-light-text dark:text-dark-text font-editorial text-lg mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-4 line-clamp-3">
                {article.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <span>{article.publishedAt}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-lime-accent transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-lime-accent transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-light-border dark:border-dark-border">
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{article.source}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <button className="bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border px-8 py-3 rounded-xl text-light-text dark:text-dark-text hover:border-lime-accent/30 hover:text-lime-accent transition-all font-medium">
          Load More Articles
        </button>
      </motion.div>
    </div>
  );
};