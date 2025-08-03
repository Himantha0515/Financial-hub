import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface FixedDeposit {
  id: string;
  user_id: string;
  bank_name: string;
  principal_amount: number;
  interest_rate: number;
  term_months: number;
  start_date: string;
  maturity_date: string;
  maturity_amount: number;
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: string;
  created_at: string;
}

export interface EMIReminder {
  id: string;
  user_id: string;
  loan_name: string;
  loan_amount: number;
  emi_amount: number;
  due_date: number;
  next_due_date: string;
  bank_name: string;
  status: 'active' | 'paid' | 'overdue';
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  currency: string;
  recipient: string;
  description?: string;
  category: string;
  location?: string;
  transaction_date: string;
  created_at: string;
}

export interface BudgetCategory {
  id: string;
  user_id: string;
  category_name: string;
  budgeted_amount: number;
  spent_amount: number;
  month_year: string;
  created_at: string;
}