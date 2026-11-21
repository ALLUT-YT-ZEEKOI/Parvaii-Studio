import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Order } from '../models/Order.js';
import { Expense } from '../models/Expense.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Reimbursement } from '../models/Reimbursement.js';
import { Collection } from '../models/Collection.js';
import { Account, AccountTransaction } from '../models/Account.js';
import { Investment } from '../models/Investment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority';

async function clearDemoData() {
  console.log('====================================================');
  console.log('🧹 PARVAII Studio — Live Database Reset');
  console.log('====================================================');
  console.log('Connecting to MongoDB Atlas...');

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('Connected to MongoDB Atlas!');

    const [orders, expenses, products, customers, reimbursements, transactions, investments] = await Promise.all([
      Order.deleteMany({}),
      Expense.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Reimbursement.deleteMany({}),
      AccountTransaction.deleteMany({}),
      Investment.deleteMany({}),
    ]);

    await Collection.updateMany({}, { products_count: 0, orders_count: 0 });
    const accounts = await Account.updateMany(
      {},
      { $set: { balance_paise: 0, opening_balance_paise: 0 } }
    );

    console.log('✅ Demo data cleared for live use:');
    console.log(`   - Orders deleted: ${orders.deletedCount}`);
    console.log(`   - Expenses deleted: ${expenses.deletedCount}`);
    console.log(`   - Products deleted: ${products.deletedCount}`);
    console.log(`   - Customers deleted: ${customers.deletedCount}`);
    console.log(`   - Reimbursements deleted: ${reimbursements.deletedCount}`);
    console.log(`   - Account transactions deleted: ${transactions.deletedCount}`);
    console.log(`   - Investments deleted: ${investments.deletedCount}`);
    console.log(`   - Accounts zeroed: ${accounts.modifiedCount}`);
    console.log('✨ Balances, stock, sales & claims are now ₹0 / 0.');
    console.log('====================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to connect or clear database:', err.message);
    if (err.message.includes('whitelist')) {
      console.error('\n⚠️ IMPORTANT: Make sure your current IP address is whitelisted in MongoDB Atlas:');
      console.error('   1. Log in to cloud.mongodb.com');
      console.error('   2. Go to Security -> Network Access');
      console.error('   3. Add IP Address -> "Allow Access From Anywhere" (0.0.0.0/0)\n');
    }
    process.exit(1);
  }
}

clearDemoData();
