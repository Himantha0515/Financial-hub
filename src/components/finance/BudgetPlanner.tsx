import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Plus, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, BudgetCategory } from '../../lib/supabase';

export const BudgetPlanner: React.FC = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formData, setFormData] = useState({
    categoryName: 'Food & Dining',
    budgetedAmount: '',
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Personal Care',
    'Other'
  ];

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user, selectedMonth]);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('month_year', selectedMonth)
        .order('category_name', { ascending: true });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('budget_categories')
        .upsert([
          {
            category_name: formData.categoryName,
            budgeted_amount: parseFloat(formData.budgetedAmount),
            spent_amount: 0,
            month_year: selectedMonth,
          },
        ], {
          onConflict: 'user_id,category_name,month_year'
        });

      if (error) throw error;

      setFormData({
        categoryName: 'Food & Dining',
        budgetedAmount: '',
      });
      setShowForm(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const updateSpentAmount = async (id: string, newAmount: number) => {
    try {
      const { error } = await supabase
        .from('budget_categories')
        .update({ spent_amount: newAmount })
        .eq('id', id);

      if (error) throw error;
      fetchBudgets();
    } catch (error) {
      console.error('Error updating spent amount:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUsagePercentage = (spent: number, budgeted: number) => {
    return budgeted > 0 ? (spent / budgeted) * 100 : 0;
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted_amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent_amount, 0);
  const remainingBudget = totalBudgeted - totalSpent;

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
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Budget Planner</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Track your monthly spending</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text focus:outline-none focus:border-lime-accent/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-lime-accent text-dark-base px-4 py-2 rounded-xl font-medium hover:shadow-glow transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center space-x-3">
            <PieChart className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Total Budget</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">{formatCurrency(totalBudgeted)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center space-x-3">
            <TrendingDown className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Total Spent</h3>
              <p className="text-2xl font-bold text-red-400 font-editorial">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Remaining</h3>
              <p className={`text-2xl font-bold font-editorial ${remainingBudget >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
                {formatCurrency(remainingBudget)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-orange-400" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Usage</h3>
              <p className={`text-2xl font-bold font-editorial ${totalBudgeted > 0 ? (totalSpent / totalBudgeted > 0.8 ? 'text-red-400' : 'text-lime-accent') : 'text-light-text dark:text-dark-text'}`}>
                {totalBudgeted > 0 ? `${((totalSpent / totalBudgeted) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Form Modal */}
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
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">Add Budget Category</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Category</label>
                <select
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Budget Amount (₹)</label>
                <input
                  type="number"
                  value={formData.budgetedAmount}
                  onChange={(e) => setFormData({ ...formData, budgetedAmount: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="10000"
                  required
                />
              </div>

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
                  Add Category
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Budget Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget, index) => {
          const usagePercentage = getUsagePercentage(budget.spent_amount, budget.budgeted_amount);
          const isOverBudget = usagePercentage > 100;
          const isNearLimit = usagePercentage > 80;
          
          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-light-text dark:text-dark-text font-editorial text-lg">{budget.category_name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isOverBudget ? 'bg-red-500/20 text-red-400' :
                  isNearLimit ? 'bg-orange-500/20 text-orange-400' :
                  'bg-lime-accent/20 text-lime-accent'
                }`}>
                  {usagePercentage.toFixed(1)}%
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">Spent</span>
                  <span className="text-light-text dark:text-dark-text font-medium">{formatCurrency(budget.spent_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">Budget</span>
                  <span className="text-light-text dark:text-dark-text font-medium">{formatCurrency(budget.budgeted_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">Remaining</span>
                  <span className={`font-medium ${
                    budget.budgeted_amount - budget.spent_amount >= 0 ? 'text-lime-accent' : 'text-red-400'
                  }`}>
                    {formatCurrency(budget.budgeted_amount - budget.spent_amount)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={`h-3 rounded-full ${
                        isOverBudget ? 'bg-red-400' :
                        isNearLimit ? 'bg-orange-400' :
                        'bg-lime-accent'
                      }`}
                    />
                  </div>
                  
                  {/* Spent amount input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={budget.spent_amount}
                      onChange={(e) => updateSpentAmount(budget.id, parseFloat(e.target.value) || 0)}
                      className="flex-1 p-2 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-lg text-sm text-light-text dark:text-dark-text focus:outline-none focus:border-lime-accent/50"
                      placeholder="Enter spent amount"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <PieChart className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-2">No Budget Categories</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">Create budget categories to track your spending</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-lime-accent text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
          >
            Create Your First Budget
          </button>
        </motion.div>
      )}
    </div>
  );
};