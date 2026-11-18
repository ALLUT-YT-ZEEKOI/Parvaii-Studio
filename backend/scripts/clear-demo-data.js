import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Order } from '../models/Order.js';
import { Expense } from '../models/Expense.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Reimbursement } from '../models/Reimbursement.js';
import { Collection } from '../models/Collection.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority';

async function clearDemoData() {
  console.log('====================================================');
  console.log('🧹 PARVAII Studio — Database Cleanup');
  console.log('====================================================');
  console.log('Connecting to MongoDB Atlas...');

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('Connected to MongoDB Atlas!');

    const [orders, expenses, products, customers, reimbursements, collections] = await Promise.all([
      Order.deleteMany({}),
      Expense.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Reimbursement.deleteMany({}),
      Collection.deleteMany({}),
    ]);

    console.log('✅ Demo data cleared:');
    console.log(`   - Orders deleted: ${orders.deletedCount}`);
    console.log(`   - Expenses deleted: ${expenses.deletedCount}`);
    console.log(`   - Products deleted: ${products.deletedCount}`);
    console.log(`   - Customers deleted: ${customers.deletedCount}`);
    console.log(`   - Reimbursements deleted: ${reimbursements.deletedCount}`);
    console.log(`   - Collections deleted: ${collections.deletedCount}`);
    console.log('✨ All records cleared — your database is now 100% clean for real boutique data.');
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
