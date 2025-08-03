import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MobileNav } from './components/mobile/MobileNav';
import { AuthModal } from './components/auth/AuthModal';
import { WalletOverview } from './components/WalletOverview';
import { TransactionTimeline } from './components/TransactionTimeline';
import { FixedDepositPlanner } from './components/finance/FixedDepositPlanner';
import { StockMarketDashboard } from './components/finance/StockMarketDashboard';
import { SavingsTracker } from './components/finance/SavingsTracker';
import { EMIReminders } from './components/finance/EMIReminders';
import { BudgetPlanner } from './components/finance/BudgetPlanner';
import { InvestmentPortfolio } from './components/finance/InvestmentPortfolio';
import { FinanceNews } from './components/finance/FinanceNews';
import { ProfileSection } from './components/profile/ProfileSection';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('wallet');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const renderMainContent = () => {
    if (!user) {
      return (
        <div className="flex items-center justify-center h-96">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial mb-4">Welcome to FinanceHub</h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">Sign in to access your personal finance dashboard</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-lime-accent text-dark-base px-8 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      );
    }

    switch (activeSection) {
      case 'wallet':
        return (
          <div className="space-y-8">
            <WalletOverview />
            <TransactionTimeline />
          </div>
        );
      case 'fd':
        return <FixedDepositPlanner />;
      case 'stocks':
        return <StockMarketDashboard />;
      case 'savings':
        return <SavingsTracker />;
      case 'emi':
        return <EMIReminders />;
      case 'budget':
        return <BudgetPlanner />;
      case 'investments':
        return <InvestmentPortfolio />;
      case 'news':
        return <FinanceNews />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <WalletOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-base dark:bg-dark-base flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-lime-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-base dark:bg-dark-base text-light-text dark:text-dark-text font-editorial transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-accent/5 dark:bg-lime-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-lime-accent/3 dark:bg-lime-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="flex h-screen relative">
        {/* Desktop Sidebar */}
        {user && (
          <div className="hidden md:block">
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto pb-20 md:pb-8">
            <div className="p-4 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {renderMainContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && <MobileNav activeSection={activeSection} onSectionChange={setActiveSection} />}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default App;