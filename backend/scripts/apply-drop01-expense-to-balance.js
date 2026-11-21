import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Account, AccountTransaction } from '../models/Account.js';
import { Expense } from '../models/Expense.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority';
const REF = 'DROP01-FIRST-LEDGER';
const TX_REF = 'DROP01-EXPENSE-DEBIT';

async function run() {
  console.log('====================================================');
  console.log('PARVAII — Apply Drop 01 expenses to bank balance');
  console.log('====================================================');

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  const bank = await Account.findOne({ type: 'bank', is_active: true });
  if (!bank) throw new Error('No bank account found');

  const expenses = await Expense.find({
    reference_number: REF,
    status: { $ne: 'cancelled' },
  }).lean();

  const totalPaise = expenses.reduce((s, e) => s + (e.amount_paise || 0), 0);
  const totalInr = totalPaise / 100;

  const already = await AccountTransaction.findOne({
    reference_type: TX_REF,
    account_id: bank._id,
  });

  console.log(`Bank before: ₹${((bank.balance_paise || 0) / 100).toLocaleString('en-IN')}`);
  console.log(`Drop 01 expenses: ₹${totalInr.toLocaleString('en-IN')} (${expenses.length} bills)`);

  if (already) {
    console.log('Debit already applied — skipping duplicate.');
  } else if (totalPaise > 0) {
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
      transaction_date: new Date().toISOString().slice(0, 10),
      description: `Drop 01 first ledger expenses (${expenses.length} bills)`,
    });

    // Link expenses to company bank account
    await Expense.updateMany(
      { reference_number: REF },
      { $set: { company_account_id: bank._id, funding_source: 'company_account' } }
    );

    console.log(`Debited ₹${totalInr.toLocaleString('en-IN')}`);
    console.log(`Bank after:  ₹${(newBalance / 100).toLocaleString('en-IN')}`);
  }

  const refreshed = await Account.findById(bank._id);
  console.log('----------------------------------------------------');
  console.log(`Balance amount should show: ₹${((refreshed?.balance_paise || 0) / 100).toLocaleString('en-IN')}`);
  console.log('====================================================');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error('Failed:', err.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
