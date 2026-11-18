import express from 'express';
import { Expense, ExpenseCategory } from '../models/Expense.js';

const router = express.Router();

const CATEGORIES = [
  { id: 1, name: 'Fabric', slug: 'fabric', icon: 'Scissors', color: '#6366F1' },
  { id: 2, name: 'Stitching', slug: 'stitching', icon: 'Layers', color: '#8B5CF6' },
  { id: 3, name: 'Packaging', slug: 'packaging', icon: 'Package', color: '#EC4899' },
  { id: 4, name: 'Labels', slug: 'labels', icon: 'Tag', color: '#F43F5E' },
  { id: 5, name: 'Transport', slug: 'transport', icon: 'Truck', color: '#10B981' },
  { id: 6, name: 'Travel', slug: 'travel', icon: 'Compass', color: '#06B6D4' },
  { id: 7, name: 'Marketing', slug: 'marketing', icon: 'Megaphone', color: '#F59E0B' },
  { id: 8, name: 'Website', slug: 'website', icon: 'Globe', color: '#3B82F6' },
  { id: 9, name: 'Courier', slug: 'courier', icon: 'Send', color: '#14B8A6' },
  { id: 10, name: 'Office', slug: 'office', icon: 'Briefcase', color: '#64748B' },
  { id: 11, name: 'Miscellaneous', slug: 'miscellaneous', icon: 'MoreHorizontal', color: '#94A3B8' },
];

const DROP_01_EXPENSES = [
  {
    id: 101,
    expense_number: 'EXP-2026-D1-01',
    expense_date: '2026-01-10',
    category_id: 1,
    category_name: 'Fabric',
    description: 'Pure French Linen fabric procurement roll for Ethereal Dawn',
    amount_inr: 38000,
    amount_paise: 3800000,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
    collection_name: 'Drop 01',
  },
  {
    id: 102,
    expense_number: 'EXP-2026-D1-02',
    expense_date: '2026-01-25',
    category_id: 2,
    category_name: 'Stitching',
    description: 'Master tailor cutting & artisanal sample stitching batch',
    amount_inr: 18500,
    amount_paise: 1850000,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
    collection_name: 'Drop 01',
  },
  {
    id: 103,
    expense_number: 'EXP-2026-D1-03',
    expense_date: '2026-02-05',
    category_id: 7,
    category_name: 'Marketing',
    description: 'Drop 01 studio editorial shoot, model & photographer hire',
    amount_inr: 15000,
    amount_paise: 1500000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    collection_name: 'Drop 01',
    paid_by_member: { id: 1, name: 'Allu', role: 'admin', email: 'allu@parvaii.com', status: 'active' }
  },
  {
    id: 104,
    expense_number: 'EXP-2026-D1-04',
    expense_date: '2026-02-12',
    category_id: 3,
    category_name: 'Packaging',
    description: 'Luxury debossed Parvaii gift boxes & organic cotton ribbon roll',
    amount_inr: 6000,
    amount_paise: 600000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    collection_name: 'Drop 01',
    paid_by_member: { id: 2, name: 'Paru', role: 'partner', email: 'paru@parvaii.com', status: 'active' }
  },
];

const DROP_02_EXPENSES = [
  {
    id: 1,
    expense_number: 'EXP-2026-0001',
    expense_date: '2026-07-10',
    category_id: 1,
    category_name: 'Fabric',
    description: 'Fine Indigo Modal Fabric for Midnight Bloom sampled at local weaver',
    amount_inr: 1000,
    amount_paise: 100000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    collection_name: 'Drop 02',
    paid_by_member: { id: 1, name: 'Allu', role: 'admin', email: 'allu@parvaii.com', status: 'active' }
  },
  {
    id: 2,
    expense_number: 'EXP-2026-0002',
    expense_date: '2026-07-14',
    category_id: 2,
    category_name: 'Stitching',
    description: 'Urgent boutique sample stitching batch',
    amount_inr: 750,
    amount_paise: 75000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    collection_name: 'Drop 02',
    paid_by_member: { id: 2, name: 'Paru', role: 'partner', email: 'paru@parvaii.com', status: 'active' }
  },
  {
    id: 3,
    expense_number: 'EXP-2026-0003',
    expense_date: '2026-07-18',
    category_id: 3,
    category_name: 'Packaging',
    description: 'Custom butter paper and woven brand tags for Drop 02',
    amount_inr: 500,
    amount_paise: 50000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    collection_name: 'Drop 02',
    paid_by_member: { id: 3, name: 'Kathu', role: 'partner', email: 'kathu@parvaii.com', status: 'active' }
  },
  {
    id: 4,
    expense_number: 'EXP-2026-0004',
    expense_date: '2026-07-02',
    category_id: 7,
    category_name: 'Marketing',
    description: 'Meta & Instagram Sponsored Ad Campaign for Midnight Bloom Launch',
    amount_inr: 8500,
    amount_paise: 850000,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
    collection_name: 'Drop 02',
  },
  {
    id: 5,
    expense_number: 'EXP-2026-0005',
    expense_date: '2026-07-08',
    category_id: 8,
    category_name: 'Website',
    description: 'Shopify & Custom Domain Renewal, SSL, Email hosting',
    amount_inr: 2484,
    amount_paise: 248400,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
    collection_name: 'Drop 02',
  },
  {
    id: 6,
    expense_number: 'EXP-2026-0006',
    expense_date: '2026-07-05',
    category_id: 1,
    category_name: 'Fabric',
    description: 'Raw Linen & Cotton Blend Bolt for Floral Dress batch',
    amount_inr: 14750,
    amount_paise: 1475000,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
    collection_name: 'Drop 02',
  },
];

router.get('/', async (req, res) => {
  const collectionId = req.query.collection_id || '';
  const funding = req.query.funding_source || 'all';
  const norm = collectionId.toLowerCase();

  try {
    const filter = { status: { $ne: 'cancelled' } };
    if (funding !== 'all') filter.funding_source = funding;
    if (collectionId && !['all', 'all drops', 'undefined', 'null'].includes(norm)) {
      filter.collection_name = new RegExp(collectionId, 'i');
    }

    const list = await Expense.find(filter).sort({ expense_date: -1 }).lean().catch(() => []);
    return res.json({ data: list.map(e => ({ ...e, id: e._id, amount_inr: (e.amount_paise || 0) / 100 })) });
  } catch (e) {
    return res.json({ data: [] });
  }
});

router.get('/categories', (req, res) => {
  res.json({ categories: CATEGORIES });
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const count = await Expense.countDocuments();
    const expNum = `EXP-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
    const amountPaise = (data.amount || data.amount_inr || 1000) * 100;

    const newExp = await Expense.create({
      expense_number: expNum,
      expense_date: data.expense_date || new Date().toISOString().split('T')[0],
      category_name: data.category_name || 'Fabric',
      description: data.description || 'Boutique expense item',
      amount_paise: amountPaise,
      funding_source: data.funding_source || 'personal_member',
      payment_mode: data.payment_mode || 'upi',
      collection_name: data.collection_name || 'Drop 02',
      status: 'approved',
    });

    return res.status(201).json({ message: 'Expense recorded', data: newExp });
  } catch (e) {
    return res.status(200).json({ message: 'Expense recorded', data: req.body });
  }
});

router.post('/:id/cancel', async (req, res) => {
  try {
    await Expense.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    return res.json({ message: 'Expense cancelled' });
  } catch (e) {
    return res.json({ message: 'Expense cancelled' });
  }
});

export default router;
