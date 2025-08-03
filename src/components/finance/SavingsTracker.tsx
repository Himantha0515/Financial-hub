import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, SavingsGoal } from '../../lib/supabase';
import { format } from 'date-fns';

export const SavingsTracker: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'Emergency Fund',
  });

  const categories = ['Emergency Fund', 'Vacation', 'Home Down Payment', 'Car Purchase', 'Education', 'Retirement', 'Other'];

  useEffect(() => {
    if (user) {
      fetchSavingsGoals();
    }
  }, [user]);

  const fetchSavingsGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching savings goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingGoal) {
        const { error } = await supabase
          .from('savings_goals')
          .update({
            title: formData.title,
            target_amount: parseFloat(formData.targetAmount),
            current_amount: parseFloat(formData.currentAmount),
            target_date: formData.targetDate,
            category: formData.category,
          })
          .eq('id', editingGoal.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('savings_goals')
          .insert([
            {
              user_id: user.id,
              title: formData.title,
              target_amount: parseFloat(formData.targetAmount),
              current_amount: parseFloat(formData.currentAmount) || 0,
              target_date: formData.targetDate,
              category: formData.category,
            },
          ]);

        if (error) throw error;
      }

      setFormData({
        title: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        category: 'Emergency Fund',
      });
      setShowForm(false);
      setEditingGoal(null);
      fetchSavingsGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSavingsGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const editGoal = (goal: SavingsGoal) => {
    setFormData({
      title: goal.title,
      targetAmount: goal.target_amount.toString(),
      currentAmount: goal.current_amount.toString(),
      targetDate: goal.target_date,
      category: goal.category,
    });
    setEditingGoal(goal);
    setShowForm(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Emergency Fund': 'bg-red-500/20 text-red-400',
      'Vacation': 'bg-blue-500/20 text-blue-400',
      'Home Down Payment': 'bg-purple-500/20 text-purple-400',
      'Car Purchase': 'bg-orange-500/20 text-orange-400',
      'Education': 'bg-green-500/20 text-green-400',
      'Retirement': 'bg-pink-500/20 text-pink-400',
      'Other': 'bg-gray-500/20 text-gray-400',
    };
    return colors[category] || colors['Other'];
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
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">Savings Goals</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Track your financial milestones</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-lime-accent text-dark-base px-4 py-2 rounded-xl font-medium hover:shadow-glow transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
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
            <Target className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Total Goals</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">{goals.length}</p>
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
              <h3 className="font-bold text-light-text dark:text-dark-text">Total Saved</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.current_amount, 0))}
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
            <Target className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Target Amount</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.target_amount, 0))}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goals Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowForm(false);
            setEditingGoal(null);
            setFormData({
              title: '',
              targetAmount: '',
              currentAmount: '',
              targetDate: '',
              category: 'Emergency Fund',
            });
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">
              {editingGoal ? 'Edit Goal' : 'Add Savings Goal'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Goal Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="500000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Current Amount (₹)</label>
                <input
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                    setFormData({
                      title: '',
                      targetAmount: '',
                      currentAmount: '',
                      targetDate: '',
                      category: 'Emergency Fund',
                    });
                  }}
                  className="flex-1 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text hover:border-lime-accent/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-lime-accent text-dark-base rounded-xl font-medium hover:shadow-glow transition-all"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal, index) => {
          const progress = getProgressPercentage(goal.current_amount, goal.target_amount);
          const isCompleted = progress >= 100;
          const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-light-text dark:text-dark-text font-editorial text-lg">{goal.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => editGoal(goal)}
                    className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-lime-accent transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">Progress</span>
                  <span className={`font-bold ${isCompleted ? 'text-lime-accent' : 'text-light-text dark:text-dark-text'}`}>
                    {progress.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={`h-3 rounded-full ${isCompleted ? 'bg-lime-accent' : 'bg-lime-accent/70'}`}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-lime-accent font-medium">{formatCurrency(goal.current_amount)}</span>
                    <span className="text-light-text dark:text-dark-text font-medium">{formatCurrency(goal.target_amount)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-light-border dark:border-dark-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Target Date:</span>
                    <span className="text-light-text dark:text-dark-text font-medium">
                      {format(new Date(goal.target_date), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Time left:</span>
                    <span className={`font-medium ${daysLeft < 30 ? 'text-red-400' : 'text-light-text dark:text-dark-text'}`}>
                      {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Target className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-2">No Savings Goals</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">Create your first savings goal to start tracking progress</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-lime-accent text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
          >
            Create Your First Goal
          </button>
        </motion.div>
      )}
    </div>
  );
};