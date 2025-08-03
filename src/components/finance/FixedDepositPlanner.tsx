import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calculator, Trash2, Building, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, FixedDeposit } from '../../lib/supabase';
import { addMonths, format } from 'date-fns';

export const FixedDepositPlanner: React.FC = () => {
  const { user } = useAuth();
  const [fds, setFds] = useState<FixedDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    principalAmount: '',
    interestRate: '',
    termMonths: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    if (user) {
      fetchFixedDeposits();
    }
  }, [user]);

  const fetchFixedDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('fixed_deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFds(data || []);
    } catch (error) {
      console.error('Error fetching fixed deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMaturity = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12;
    const maturityAmount = principal * Math.pow(1 + monthlyRate, months);
    return maturityAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const principal = parseFloat(formData.principalAmount);
    const rate = parseFloat(formData.interestRate);
    const months = parseInt(formData.termMonths);
    const startDate = new Date(formData.startDate);
    const maturityDate = addMonths(startDate, months);
    const maturityAmount = calculateMaturity(principal, rate, months);

    try {
      const { error } = await supabase
        .from('fixed_deposits')
        .insert([
          {
            user_id: user.id,
            bank_name: formData.bankName,
            principal_amount: principal,
            interest_rate: rate,
            term_months: months,
            start_date: formData.startDate,
            maturity_date: format(maturityDate, 'yyyy-MM-dd'),
            maturity_amount: maturityAmount,
          },
        ]);

      if (error) throw error;

      setFormData({
        bankName: '',
        principalAmount: '',
        interestRate: '',
        termMonths: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
      });
      setShowForm(false);
      fetchFixedDeposits();
    } catch (error) {
      console.error('Error creating fixed deposit:', error);
    }
  };

  const deleteFD = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fixed_deposits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchFixedDeposits();
    } catch (error) {
      console.error('Error deleting fixed deposit:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-lime-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Fixed Deposits</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Plan and track your FD investments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-lime-accent text-dark-base px-4 py-2 rounded-xl font-medium hover:shadow-glow transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add FD</span>
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Building className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Total Invested</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">
                {formatCurrency(fds.reduce((sum, fd) => sum + fd.principal_amount, 0))}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Expected Returns</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">
                {formatCurrency(fds.reduce((sum, fd) => sum + (fd.maturity_amount - fd.principal_amount), 0))}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Calendar className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Active FDs</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">{fds.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FD Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">Add Fixed Deposit</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="e.g., HDFC Bank"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Principal Amount (₹)</label>
                <input
                  type="number"
                  value={formData.principalAmount}
                  onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="100000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="7.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Term (Months)</label>
                <select
                  value={formData.termMonths}
                  onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  required
                >
                  <option value="">Select term</option>
                  <option value="12">1 Year</option>
                  <option value="24">2 Years</option>
                  <option value="36">3 Years</option>
                  <option value="60">5 Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  required
                />
              </div>

              {/* Preview */}
              {formData.principalAmount && formData.interestRate && formData.termMonths && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-lime-accent/10 border border-lime-accent/20 rounded-xl p-4"
                >
                  <h4 className="font-bold text-lime-accent mb-2">Maturity Preview</h4>
                  <p className="text-light-text dark:text-dark-text">
                    Maturity Amount: <span className="font-bold text-lime-accent">
                      {formatCurrency(calculateMaturity(
                        parseFloat(formData.principalAmount),
                        parseFloat(formData.interestRate),
                        parseInt(formData.termMonths)
                      ))}
                    </span>
                  </p>
                </motion.div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text hover:border-lime-accent/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-lime-accent text-dark-base rounded-xl font-medium hover:shadow-glow transition-all"
                >
                  Create FD
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* FD List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fds.map((fd, index) => {
          const daysToMaturity = Math.ceil((new Date(fd.maturity_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const isMatured = daysToMaturity <= 0;
          
          return (
            <motion.div
              key={fd.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-light-text dark:text-dark-text font-editorial text-lg">{fd.bank_name}</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                    {fd.term_months} months • {fd.interest_rate}% p.a.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isMatured ? 'bg-lime-accent/20 text-lime-accent' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {isMatured ? 'Matured' : 'Active'}
                  </span>
                  <button
                    onClick={() => deleteFD(fd.id)}
                    className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">Principal:</span>
                  <span className="font-medium text-light-text dark:text-dark-text">{formatCurrency(fd.principal_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">Maturity:</span>
                  <span className="font-bold text-lime-accent">{formatCurrency(fd.maturity_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">Interest:</span>
                  <span className="font-medium text-lime-accent">
                    {formatCurrency(fd.maturity_amount - fd.principal_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">Maturity Date:</span>
                  <span className="font-medium text-light-text dark:text-dark-text">
                    {format(new Date(fd.maturity_date), 'dd MMM yyyy')}
                  </span>
                </div>
                
                {!isMatured && (
                  <div className="mt-4 pt-3 border-t border-light-border dark:border-dark-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">Time to maturity:</span>
                      <span className="text-light-text dark:text-dark-text font-medium">{daysToMaturity} days</span>
                    </div>
                    <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((fd.term_months * 30 - daysToMaturity) / (fd.term_months * 30)) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        className="h-2 bg-lime-accent rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {fds.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calculator className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-2">No Fixed Deposits</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">Start planning your FD investments today</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-lime-accent text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
          >
            Create Your First FD
          </button>
        </motion.div>
      )}
    </div>
  );
};