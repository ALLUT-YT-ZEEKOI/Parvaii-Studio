import express from 'express';
import { Order } from '../models/Order.js';
import { Expense } from '../models/Expense.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Reimbursement } from '../models/Reimbursement.js';
import { Collection } from '../models/Collection.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    company: {
      name: 'PARVAII',
      legal_name: 'Parvaii Apparel LLP',
      brand_tagline: 'Clothing Brand Management System',
      currency: 'INR',
      currency_symbol: '₹',
      phone: '+91 98400 12345',
      email: 'studio@parvaii.com',
      address: 'Plot 42, Design District, Chennai, Tamil Nadu 600028',
      gst_number: '33AAACP1234M1Z5',
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    categories: ['Tops', 'Dresses', 'Kurtis', 'Co-ords', 'Sarees', 'Bottoms'],
  });
});

router.post('/', (req, res) => {
  res.json({ message: 'Settings saved' });
});

router.get('/audit-logs', (req, res) => {
  res.json({ data: [] });
});

// Clear all demo data from database
router.post('/clear-database', async (req, res) => {
  try {
    const [orders, expenses, products, customers, reimbursements, collections] = await Promise.all([
      Order.deleteMany({}),
      Expense.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Reimbursement.deleteMany({}),
      Collection.deleteMany({}),
    ]);

    return res.json({
      success: true,
      message: 'Demo database cleared successfully! Ready for your real studio data.',
      deleted: {
        orders: orders.deletedCount,
        expenses: expenses.deletedCount,
        products: products.deletedCount,
        customers: customers.deletedCount,
        reimbursements: reimbursements.deletedCount,
        collections: collections.deletedCount,
      }
    });
  } catch (err) {
    console.error('[Clear Database Error]', err);
    return res.status(500).json({ error: 'Failed to clear database', message: err.message });
  }
});

export default router;
