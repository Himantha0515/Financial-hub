# Personal Finance App

A comprehensive personal finance management application built with React, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Features

- **Wallet Overview**: Portfolio and currency balances
- **Transaction Timeline**: Recent transactions with animations
- **Fixed Deposit Planner**: Calculate maturity amounts and track FDs
- **Stock Market Dashboard**: Live market data and indices
- **Savings Tracker**: Create and track savings goals
- **EMI Reminders**: Loan payment reminders with status tracking
- **Budget Planner**: Income vs expense tracking
- **Investment Portfolio**: Portfolio management and insights
- **Finance News**: Latest financial news and tips
- **Authentication**: Complete auth system with Google OAuth
- **Mobile Responsive**: Bottom navigation for mobile, sidebar for desktop
- **Theme Support**: Dark/Light/System theme switching

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database, Auth, RLS)
- **Currency**: Indian Rupee (₹) formatting
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-finance-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Run the database migrations in your Supabase dashboard or using the Supabase CLI.

6. Start the development server:
```bash
npm run dev
```

## Database Schema

The app uses the following Supabase tables:
- `profiles` - User profile information
- `fixed_deposits` - Fixed deposit records
- `savings_goals` - Savings goal tracking
- `emi_reminders` - EMI payment reminders
- `budget_categories` - Budget planning data
- `transactions` - Transaction history

## Authentication

- Email/Password authentication
- Google OAuth integration
- Password reset functionality
- Row Level Security (RLS) for data protection

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License