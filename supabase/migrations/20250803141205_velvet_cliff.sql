/*
  # Personal Finance App Database Schema

  1. New Tables
    - `fixed_deposits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `bank_name` (text)
      - `principal_amount` (decimal)
      - `interest_rate` (decimal)
      - `term_months` (integer)
      - `start_date` (date)
      - `maturity_date` (date)
      - `maturity_amount` (decimal)
      - `created_at` (timestamp)
    
    - `savings_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `target_amount` (decimal)
      - `current_amount` (decimal)
      - `target_date` (date)
      - `category` (text)
      - `created_at` (timestamp)
    
    - `emi_reminders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `loan_name` (text)
      - `loan_amount` (decimal)
      - `emi_amount` (decimal)
      - `due_date` (date)
      - `next_due_date` (date)
      - `bank_name` (text)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `type` (text)
      - `amount` (decimal)
      - `currency` (text)
      - `recipient` (text)
      - `description` (text)
      - `category` (text)
      - `location` (text)
      - `transaction_date` (timestamp)
      - `created_at` (timestamp)
    
    - `budget_categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `category_name` (text)
      - `budgeted_amount` (decimal)
      - `spent_amount` (decimal)
      - `month_year` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Fixed Deposits table
CREATE TABLE IF NOT EXISTS fixed_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bank_name text NOT NULL,
  principal_amount decimal(15,2) NOT NULL,
  interest_rate decimal(5,2) NOT NULL,
  term_months integer NOT NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  maturity_date date NOT NULL,
  maturity_amount decimal(15,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fixed_deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own fixed deposits"
  ON fixed_deposits
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Savings Goals table
CREATE TABLE IF NOT EXISTS savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  target_amount decimal(15,2) NOT NULL,
  current_amount decimal(15,2) DEFAULT 0,
  target_date date NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own savings goals"
  ON savings_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- EMI Reminders table
CREATE TABLE IF NOT EXISTS emi_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  loan_name text NOT NULL,
  loan_amount decimal(15,2) NOT NULL,
  emi_amount decimal(15,2) NOT NULL,
  due_date integer NOT NULL CHECK (due_date >= 1 AND due_date <= 31),
  next_due_date date NOT NULL,
  bank_name text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paid', 'overdue')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emi_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own EMI reminders"
  ON emi_reminders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  amount decimal(15,2) NOT NULL,
  currency text DEFAULT 'INR',
  recipient text NOT NULL,
  description text,
  category text NOT NULL,
  location text,
  transaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Budget Categories table
CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_name text NOT NULL,
  budgeted_amount decimal(15,2) NOT NULL,
  spent_amount decimal(15,2) DEFAULT 0,
  month_year text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_name, month_year)
);

ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own budget categories"
  ON budget_categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_id ON fixed_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_emi_reminders_user_id ON emi_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_user_id ON budget_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_emi_next_due ON emi_reminders(next_due_date);