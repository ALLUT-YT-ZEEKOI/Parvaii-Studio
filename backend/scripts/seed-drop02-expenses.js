import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Expense } from '../models/Expense.js';
import { Collection } from '../models/Collection.js';
import { Account, AccountTransaction } from '../models/Account.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority';
const REF = 'DROP02-FIRST-LEDGER';
const TX_REF = 'DROP02-EXPENSE-DEBIT';
const DEFAULT_DATE = '2026-11-21';

/** Drop 02 expenses from founders ledger */
const RAW = [
  { category: 'Marketing', description: 'Jio Prepaid Recharge', amount: 147 },
  { category: 'Food', description: 'Mahalakshmi Tiffin Center', amount: 180 },
  { category: 'Travel', description: 'Uber Charge', amount: 75 },
  { category: 'Travel', description: 'Uber Charge', amount: 82 },
  { category: 'Travel', description: 'Uber Charge', amount: 76 },
  { category: 'Fabric', description: 'Chitra Textiles Industries', amount: 3526 },
  { category: 'Travel', description: 'Uber Charge', amount: 74 },
  { category: 'Food', description: 'Bakery', amount: 40 },
  { category: 'Food', description: 'Asha J — Food Expense', amount: 455 },
  { category: 'Travel', description: 'Uber Charge', amount: 75 },
  { category: 'Travel', description: 'Stay room', amount: 1000 },
  { category: 'Fabric', description: 'Sree Shakthi Textiles', amount: 6539 },
  { category: 'Travel', description: 'Uber', amount: 50 },
  { category: 'Travel', description: 'Uber Charge', amount: 75 },
  { category: 'Travel', description: 'Railway Station Dormitory', amount: 100 },
];

async function seed() {
  console.log('====================================================');
  console.log('PARVAII — Seed Drop 02 Expenses + apply to balance');
  console.log('====================================================');

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB Atlas');

  let drop02 = await Collection.findOne({ name: 'Drop 02' });
  if (!drop02) {
    drop02 = await Collection.create({
      name: 'Drop 02',
      code: 'DROP-02',
      subtitle: 'Midnight Bloom',
      season: 'Monsoon 2026',
      status: 'active',
      products_count: 0,
      orders_count: 0,
    });
    console.log('Created Drop 02 collection');
  } else {
    console.log(`Found collection: ${drop02.name} (${drop02._id})`);
  }

  const bank = await Account.findOne({ type: 'bank', is_active: true });
  if (!bank) throw new Error('No bank account found');
  console.log(`Bank before: ₹${((bank.balance_paise || 0) / 100).toLocaleString('en-IN')}`);

  const cleared = await Expense.deleteMany({
    collection_name: 'Drop 02',
    reference_number: REF,
  });
  if (cleared.deletedCount) {
    console.log(`Cleared previous Drop 02 seed rows: ${cleared.deletedCount}`);
  }

  // If a previous debit exists, reverse it before re-applying (idempotent re-run)
  const prevDebit = await AccountTransaction.findOne({
    reference_type: TX_REF,
    account_id: bank._id,
  });
  if (prevDebit) {
    bank.balance_paise = (bank.balance_paise || 0) + (prevDebit.amount_paise || 0);
    await bank.save();
    await AccountTransaction.deleteOne({ _id: prevDebit._id });
    console.log(`Reversed previous Drop 02 debit: ₹${((prevDebit.amount_paise || 0) / 100).toLocaleString('en-IN')}`);
  }

  const expectedTotal = RAW.reduce((s, r) => s + r.amount, 0);
  const docs = RAW.map((row, i) => ({
    expense_number: `EXP-2026-D2-${String(i + 1).padStart(2, '0')}`,
    expense_date: DEFAULT_DATE,
    category_name: row.category,
    description: row.description,
    amount_paise: Math.round(row.amount * 100),
    funding_source: 'company_account',
    payment_mode: 'upi',
    collection_id: drop02._id,
    collection_name: 'Drop 02',
    company_account_id: bank._id,
    reference_number: REF,
    status: 'approved',
    notes: 'Drop 02 expense ledger',
  }));

  await Expense.insertMany(docs);

  const totalPaise = Math.round(expectedTotal * 100);
  const newBalance = Math.max(0, (bank.balance_paise || 0) - totalPaise);
  bank.balance_paise = newBalance;
  await bank.save();

  await AccountTransaction.create({
    account_id: bank._id,
    type: 'debit',
    amount_paise: totalPaise,
    balance_after_paise: newBalance,
    payment_mode: 'upi',
    reference_type: TX_REF,
    reference_number: REF,
    transaction_date: DEFAULT_DATE,
    description: `Drop 02 ledger expenses (${RAW.length} bills)`,
  });

  console.log('----------------------------------------------------');
  console.log(`Inserted: ${RAW.length} Drop 02 expenses`);
  console.log(`Total expenses: ₹${expectedTotal.toLocaleString('en-IN')}`);
  console.log(`Bank after:     ₹${(newBalance / 100).toLocaleString('en-IN')}`);
  console.log('====================================================');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('Failed:', err.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
