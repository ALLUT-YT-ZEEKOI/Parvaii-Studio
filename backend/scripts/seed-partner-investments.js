import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Account, AccountTransaction } from '../models/Account.js';
import { Investment } from '../models/Investment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority';

const AMOUNT_INR = 15000;
const AMOUNT_PAISE = AMOUNT_INR * 100;
const PARTNERS = [
  { name: 'Allu', email: 'allu@parvaii.com', role: 'admin', phone: '+91 98765 00001', equity_percentage: 34, title: 'Co-Founder & Chief Technology Officer (CTO)' },
  { name: 'Paru', email: 'paru@parvaii.com', role: 'partner', phone: '+91 98765 00002', equity_percentage: 33, title: 'Co-Founder & Creative Director' },
  { name: 'Kathu', email: 'kathu@parvaii.com', role: 'partner', phone: '+91 98765 00003', equity_percentage: 33, title: 'Co-Founder & Social Media Manager' },
];

async function ensurePartners() {
  const users = [];
  for (const p of PARTNERS) {
    let user = await User.findOne({ email: p.email });
    if (!user) {
      user = await User.create({ ...p, password: 'password', status: 'active' });
      console.log(`Created partner: ${p.name}`);
    } else {
      console.log(`Found partner: ${p.name}`);
    }
    users.push(user);
  }
  return users;
}

async function ensureBankAccount() {
  let bank = await Account.findOne({ type: 'bank', is_active: true });
  if (!bank) {
    bank = await Account.create({
      name: 'HDFC Bank Current A/c',
      type: 'bank',
      bank_name: 'HDFC Bank',
      account_number: '50200084920194',
      ifsc_code: 'HDFC0001234',
      branch: 'T. Nagar, Chennai',
      balance_paise: 0,
      opening_balance_paise: 0,
      is_active: true,
    });
    console.log('Created bank account');
  }

  let cash = await Account.findOne({ type: 'cash', is_active: true });
  if (!cash) {
    cash = await Account.create({
      name: 'Studio Cash Box',
      type: 'cash',
      balance_paise: 0,
      opening_balance_paise: 0,
      is_active: true,
    });
    console.log('Created cash account');
  }

  return bank;
}

async function seedInvestments() {
  console.log('====================================================');
  console.log('PARVAII — Seed Partner Investments (₹15,000 each)');
  console.log('====================================================');

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB Atlas');

  const users = await ensurePartners();
  const bank = await ensureBankAccount();
  const today = new Date().toISOString().slice(0, 10);

  let credited = 0;

  for (const user of users) {
    const existing = await Investment.findOne({
      user_id: user._id,
      investment_type: 'initial_capital',
      amount_paise: AMOUNT_PAISE,
    });

    if (existing) {
      console.log(`Skip ${user.name}: initial ₹${AMOUNT_INR} already recorded`);
      continue;
    }

    const newBalance = (bank.balance_paise || 0) + AMOUNT_PAISE;
    bank.balance_paise = newBalance;
    await bank.save();

    await AccountTransaction.create({
      account_id: bank._id,
      type: 'credit',
      amount_paise: AMOUNT_PAISE,
      balance_after_paise: newBalance,
      payment_mode: 'bank_transfer',
      reference_type: 'partner_investment',
      transaction_date: today,
      description: `Initial capital — ${user.name}`,
    });

    await Investment.create({
      user_id: user._id,
      account_id: bank._id,
      amount_paise: AMOUNT_PAISE,
      investment_type: 'initial_capital',
      notes: `Initial partner capital — ${user.name} ₹${AMOUNT_INR}`,
      transaction_date: today,
    });

    credited += AMOUNT_INR;
    console.log(`Recorded ${user.name}: ₹${AMOUNT_INR.toLocaleString('en-IN')}`);
  }

  const refreshed = await Account.findById(bank._id);
  const allInvestments = await Investment.find().lean();
  const totalInvested = allInvestments.reduce((sum, inv) => sum + (inv.amount_paise || 0), 0) / 100;

  console.log('----------------------------------------------------');
  console.log(`Newly credited this run: ₹${credited.toLocaleString('en-IN')}`);
  console.log(`Total partner investments: ₹${totalInvested.toLocaleString('en-IN')}`);
  console.log(`Bank balance now: ₹${((refreshed?.balance_paise || 0) / 100).toLocaleString('en-IN')}`);
  console.log('====================================================');

  await mongoose.disconnect();
  process.exit(0);
}

seedInvestments().catch(async (err) => {
  console.error('Failed:', err.message);
  if (err.message.includes('whitelist')) {
    console.error('Whitelist your IP in MongoDB Atlas Network Access.');
  }
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
