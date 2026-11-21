import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Collection } from './models/Collection.js';
import { User } from './models/User.js';
import { Account } from './models/Account.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { Expense } from './models/Expense.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority';

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to Atlas successfully!');

    // 1. Collections (Drop 01, Drop 02)
    const existingCols = await Collection.countDocuments();
    if (existingCols === 0) {
      console.log('[Seed] Seeding Collections...');
      await Collection.create([
        { name: 'Drop 01', code: 'DROP-01', subtitle: 'Ethereal Dawn', season: 'Summer 2026', status: 'archived', products_count: 0, orders_count: 0 },
        { name: 'Drop 02', code: 'DROP-02', subtitle: 'Midnight Bloom', season: 'Monsoon 2026', status: 'active', products_count: 0, orders_count: 0 },
      ]);
    }

    // 2. Users (Allu, Paru, Kathu)
    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      console.log('[Seed] Seeding Founding Partners...');
      await User.create([
        { name: 'Allu', email: 'allu@parvaii.com', password: 'password', role: 'admin', phone: '+91 98765 00001', equity_percentage: 34, title: 'Co-Founder & Chief Technology Officer (CTO)' },
        { name: 'Paru', email: 'paru@parvaii.com', password: 'password', role: 'partner', phone: '+91 98765 00002', equity_percentage: 33, title: 'Co-Founder & Creative Director' },
        { name: 'Kathu', email: 'kathu@parvaii.com', password: 'password', role: 'partner', phone: '+91 98765 00003', equity_percentage: 33, title: 'Co-Founder & Social Media Manager' },
      ]);
    }

    // 3. Accounts (start at ₹0 for live use)
    const existingAccounts = await Account.countDocuments();
    if (existingAccounts === 0) {
      console.log('[Seed] Seeding Accounts...');
      await Account.create([
        { name: 'HDFC Bank Current A/c', type: 'bank', bank_name: 'HDFC Bank', account_number: '50200084920194', ifsc_code: 'HDFC0001234', branch: 'T. Nagar, Chennai', balance_paise: 0, opening_balance_paise: 0, is_active: true },
        { name: 'Studio Cash Box', type: 'cash', balance_paise: 0, opening_balance_paise: 0, is_active: true },
      ]);
    }

    console.log('[Seed] Seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err.message);
    process.exit(0);
  }
}

seed();
