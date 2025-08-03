import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, AlertTriangle, CheckCircle, Clock, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, EMIReminder } from '../../lib/supabase';
import { format, addMonths, isAfter, isBefore } from 'date-fns';

export const EMIReminders: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<EMIReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<EMIReminder | null>(null);
  const [formData, setFormData] = useState({
    loanName: '',
    loanAmount: '',
    emiAmount: '',
    dueDate: '',
    bankName: '',
  });

  useEffect(() => {
    if (user) {
      fetchEMIReminders();
    }
  }, [user]);

  const fetchEMIReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('emi_reminders')
        .select('*')
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching EMI reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextDueDate = (dueDate: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let nextDue = new Date(currentYear, currentMonth, dueDate);
    
    if (isBefore(nextDue, today)) {
      nextDue = addMonths(nextDue, 1);
    }
    
    return format(nextDue, 'yyyy-MM-dd');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const nextDueDate = calculateNextDueDate(parseInt(formData.dueDate));

    try {
      if (editingReminder) {
        const { error } = await supabase
          .from('emi_reminders')
          .update({
            loan_name: formData.loanName,
            loan_amount: parseFloat(formData.loanAmount),
            emi_amount: parseFloat(formData.emiAmount),
            due_date: parseInt(formData.dueDate),
            next_due_date: nextDueDate,
            bank_name: formData.bankName,
          })
          .eq('id', editingReminder.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('emi_reminders')
          .insert([
            {
              loan_name: formData.loanName,
              loan_amount: parseFloat(formData.loanAmount),
              emi_amount: parseFloat(formData.emiAmount),
              due_date: parseInt(formData.dueDate),
              next_due_date: nextDueDate,
              bank_name: formData.bankName,
              status: 'active',
            },
          ]);

        if (error) throw error;
      }

      setFormData({
        loanName: '',
        loanAmount: '',
        emiAmount: '',
        dueDate: '',
        bankName: '',
      });
      setShowForm(false);
      setEditingReminder(null);
      fetchEMIReminders();
    } catch (error) {
      console.error('Error saving EMI reminder:', error);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emi_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEMIReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emi_reminders')
        .update({ status: 'paid' })
        .eq('id', id);

      if (error) throw error;
      fetchEMIReminders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const editReminder = (reminder: EMIReminder) => {
    setFormData({
      loanName: reminder.loan_name,
      loanAmount: reminder.loan_amount.toString(),
      emiAmount: reminder.emi_amount.toString(),
      dueDate: reminder.due_date.toString(),
      bankName: reminder.bank_name,
    });
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (reminder: EMIReminder) => {
    const today = new Date();
    const dueDate = new Date(reminder.next_due_date);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (reminder.status === 'paid') return 'bg-lime-accent/20 text-lime-accent';
    if (daysUntilDue < 0) return 'bg-red-500/20 text-red-400';
    if (daysUntilDue <= 3) return 'bg-orange-500/20 text-orange-400';
    return 'bg-blue-500/20 text-blue-400';
  };

  const getStatusText = (reminder: EMIReminder) => {
    const today = new Date();
    const dueDate = new Date(reminder.next_due_date);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (reminder.status === 'paid') return 'Paid';
    if (daysUntilDue < 0) return 'Overdue';
    if (daysUntilDue === 0) return 'Due Today';
    if (daysUntilDue <= 3) return `Due in ${daysUntilDue} days`;
    return `Due in ${daysUntilDue} days`;
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
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">EMI Reminders</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">Track your loan payments and due dates</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-lime-accent text-dark-base px-4 py-2 rounded-xl font-medium hover:shadow-glow transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add EMI</span>
        </motion.button>
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
            <Calendar className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Total EMIs</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">{reminders.length}</p>
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
            <CheckCircle className="w-8 h-8 text-lime-accent" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">This Month</h3>
              <p className="text-2xl font-bold text-lime-accent font-editorial">
                {formatCurrency(reminders.reduce((sum, r) => sum + r.emi_amount, 0))}
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
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Due Soon</h3>
              <p className="text-2xl font-bold text-orange-400 font-editorial">
                {reminders.filter(r => {
                  const daysUntilDue = Math.ceil((new Date(r.next_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilDue <= 3 && daysUntilDue >= 0 && r.status !== 'paid';
                }).length}
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
            <Clock className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="font-bold text-light-text dark:text-dark-text">Overdue</h3>
              <p className="text-2xl font-bold text-red-400 font-editorial">
                {reminders.filter(r => {
                  const daysUntilDue = Math.ceil((new Date(r.next_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilDue < 0 && r.status !== 'paid';
                }).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* EMI Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowForm(false);
            setEditingReminder(null);
            setFormData({
              loanName: '',
              loanAmount: '',
              emiAmount: '',
              dueDate: '',
              bankName: '',
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
              {editingReminder ? 'Edit EMI' : 'Add EMI Reminder'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Loan Name</label>
                <input
                  type="text"
                  value={formData.loanName}
                  onChange={(e) => setFormData({ ...formData, loanName: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="e.g., Home Loan"
                  required
                />
              </div>

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
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="2500000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">EMI Amount (₹)</label>
                <input
                  type="number"
                  value={formData.emiAmount}
                  onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  placeholder="25000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Due Date (Day of Month)</label>
                <select
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 text-light-text dark:text-dark-text"
                  required
                >
                  <option value="">Select due date</option>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingReminder(null);
                    setFormData({
                      loanName: '',
                      loanAmount: '',
                      emiAmount: '',
                      dueDate: '',
                      bankName: '',
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
                  {editingReminder ? 'Update EMI' : 'Add EMI'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* EMI List */}
      <div className="space-y-4">
        {reminders.map((reminder, index) => {
          const today = new Date();
          const dueDate = new Date(reminder.next_due_date);
          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-lime-accent/30 transition-all hover:shadow-glow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-light-text dark:text-dark-text font-editorial text-lg">{reminder.loan_name}</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">{reminder.bank_name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder)}`}>
                    {getStatusText(reminder)}
                  </span>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {reminder.status !== 'paid' && (
                      <button
                        onClick={() => markAsPaid(reminder.id)}
                        className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-lime-accent transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => editReminder(reminder)}
                      className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-lime-accent transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary block">Loan Amount</span>
                  <span className="text-light-text dark:text-dark-text font-medium">{formatCurrency(reminder.loan_amount)}</span>
                </div>
                <div>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary block">EMI Amount</span>
                  <span className="text-light-text dark:text-dark-text font-bold">{formatCurrency(reminder.emi_amount)}</span>
                </div>
                <div>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary block">Due Date</span>
                  <span className="text-light-text dark:text-dark-text font-medium">{reminder.due_date} of each month</span>
                </div>
                <div>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary block">Next Due</span>
                  <span className="text-light-text dark:text-dark-text font-medium">
                    {format(new Date(reminder.next_due_date), 'dd MMM yyyy')}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {reminders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-2">No EMI Reminders</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">Add your loan EMIs to never miss a payment</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-lime-accent text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
          >
            Add Your First EMI
          </button>
        </motion.div>
      )}
    </div>
  );
};