import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Expense } from '../models/Expense.js';
import { Collection } from '../models/Collection.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority';

/** Raw first-drop expenses from founders ledger (total ₹27,984) */
const RAW = [
  { date: '2026-07-25', category: 'Marketing', description: 'Jio Sim', amount: 400 },
  { date: '2026-08-02', category: 'Travel', description: 'Train Ticket', amount: 1134 },
  { date: '2026-08-02', category: 'Travel', description: 'Uber — South to Broadway', amount: 79 },
  { date: '2026-08-02', category: 'Food', description: 'Mandi', amount: 880 },
  { date: '2026-08-02', category: 'Travel', description: 'Uber — MandiShop to wholesale shop', amount: 79 },
  { date: '2026-08-02', category: 'Fabric', description: 'Matulya (MT Textiles)', amount: 1890 },
  { date: '2026-08-02', category: 'Fabric', description: 'Rajadhani Fabrics', amount: 4064 },
  { date: '2026-08-02', category: 'Travel', description: 'Uber — Urvasi to Marine Drive', amount: 79 },
  { date: '2026-08-02', category: 'Food', description: 'Juice', amount: 80 },
  { date: '2026-08-02', category: 'Travel', description: 'Uber — Marine Drive to South', amount: 79 },
  { date: '2026-08-02', category: 'Food', description: "Ummi's Restro", amount: 519 },
  { date: '2026-08-02', category: 'Travel', description: 'Bike petrol and paypark', amount: 160 },
  { date: '2026-08-02', category: 'Travel', description: 'Travel expense', amount: 442 },
  { date: '2026-08-06', category: 'Travel', description: 'Train Ticket', amount: 258 },
  { date: '2026-08-08', category: 'Miscellaneous', description: 'Dress for Kailas', amount: 500 },
  { date: '2026-08-08', category: 'Travel', description: 'Uber — KZM to Flat', amount: 100 },
  { date: '2026-08-14', category: 'Courier', description: 'TVM to KZD', amount: 567 },
  { date: '2026-08-14', category: 'Office', description: 'Tape and marker', amount: 85 },
  { date: '2026-09-12', category: 'Packaging', description: 'Packing materials', amount: 770 },
  { date: '2026-09-28', category: 'Travel', description: 'EKM–TVM', amount: 112 },
  { date: '2026-09-30', category: 'Website', description: 'Domain', amount: 1237 },
  { date: '2026-10-03', category: 'Food', description: 'Meals', amount: 813 },
  { date: '2026-10-11', category: 'Miscellaneous', description: 'First order gift (wipes)', amount: 170 },
  { date: '2026-10-12', category: 'Labels', description: 'Advance payment (2890 + 100)', amount: 2990 },
  { date: '2026-10-13', category: 'Packaging', description: 'Butter paper — Amazon', amount: 443 },
  { date: '2026-10-14', category: 'Packaging', description: 'Address sticker — Flipkart', amount: 222 },
  { date: '2026-10-23', category: 'Stitching', description: 'Dress stitching cost', amount: 6350 },
  { date: '2026-10-23', category: 'Packaging', description: 'Thank you card', amount: 1125 },
  { date: '2026-10-23', category: 'Website', description: 'Google storage — for Kathu', amount: 150 },
  { date: '2026-10-28', category: 'Courier', description: 'Delivery charge', amount: 382 },
  { date: '2026-10-28', category: 'Travel', description: 'Travel expense', amount: 1825 },
];

async function seed() {
  console.log('====================================================');
  console.log('PARVAII — Seed Drop 01 First Expenses');
  console.log('====================================================');

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB Atlas');

  let drop01 = await Collection.findOne({ name: 'Drop 01' });
  if (!drop01) {
    drop01 = await Collection.create({
      name: 'Drop 01',
      code: 'DROP-01',
      subtitle: 'Ethereal Dawn',
      season: 'Summer 2026',
      status: 'archived',
      products_count: 0,
      orders_count: 0,
    });
    console.log('Created Drop 01 collection');
  } else {
    console.log(`Found collection: ${drop01.name} (${drop01._id})`);
  }

  // Idempotent: remove previous Drop 01 first-ledger seed if re-run
  const existingSeed = await Expense.deleteMany({
    collection_name: 'Drop 01',
    reference_number: 'DROP01-FIRST-LEDGER',
  });
  if (existingSeed.deletedCount) {
    console.log(`Cleared previous seed rows: ${existingSeed.deletedCount}`);
  }

  const expectedTotal = RAW.reduce((s, r) => s + r.amount, 0);
  const docs = RAW.map((row, i) => ({
    expense_number: `EXP-2026-D1-${String(i + 1).padStart(2, '0')}`,
    expense_date: row.date,
    category_name: row.category,
    description: row.description,
    amount_paise: Math.round(row.amount * 100),
    funding_source: 'company_account',
    payment_mode: 'upi',
    collection_id: drop01._id,
    collection_name: 'Drop 01',
    reference_number: 'DROP01-FIRST-LEDGER',
    status: 'approved',
    notes: 'First drop expense ledger',
  }));

  await Expense.insertMany(docs);

  const saved = await Expense.find({ reference_number: 'DROP01-FIRST-LEDGER' }).lean();
  const totalInr = saved.reduce((s, e) => s + (e.amount_paise || 0), 0) / 100;

  console.log('----------------------------------------------------');
  console.log(`Inserted: ${saved.length} expenses`);
  console.log(`Expected total: ₹${expectedTotal.toLocaleString('en-IN')}`);
  console.log(`Saved total:    ₹${totalInr.toLocaleString('en-IN')}`);
  console.log('====================================================');

  if (Math.round(totalInr) !== expectedTotal) {
    console.warn('WARNING: total mismatch — check ledger amounts');
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('Failed:', err.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
