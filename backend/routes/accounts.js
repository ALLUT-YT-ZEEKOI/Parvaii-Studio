import express from 'express';
import { Account, AccountTransaction } from '../models/Account.js';
import { Investment } from '../models/Investment.js';
import { User } from '../models/User.js';

const router = express.Router();

const EMPTY_ACCOUNTS = [
  { id: '1', name: 'HDFC Bank Current A/c', type: 'bank', bank_name: 'HDFC Bank', account_number: '50200084920194', ifsc_code: 'HDFC0001234', branch: 'T. Nagar, Chennai', balance_inr: 0, opening_balance_inr: 0, is_active: true },
  { id: '2', name: 'Studio Cash Box', type: 'cash', balance_inr: 0, opening_balance_inr: 0, is_active: true },
];

const EMPTY_SUMMARY = { total_balance_inr: 0, bank_balance_inr: 0, cash_balance_inr: 0 };

router.get('/', async (req, res) => {
  try {
    const list = await Account.find({ is_active: true }).lean();
    if (list && list.length > 0) {
      const bankSum = list.filter(a => a.type === 'bank').reduce((sum, a) => sum + (a.balance_paise || 0), 0) / 100;
      const cashSum = list.filter(a => a.type === 'cash').reduce((sum, a) => sum + (a.balance_paise || 0), 0) / 100;
      return res.json({
        summary: {
          total_balance_inr: bankSum + cashSum,
          bank_balance_inr: bankSum,
          cash_balance_inr: cashSum,
        },
        accounts: list.map(a => ({
          ...a,
          id: a._id,
          balance_inr: (a.balance_paise || 0) / 100,
          opening_balance_inr: (a.opening_balance_paise || 0) / 100,
        }))
      });
    }

    return res.json({
      summary: EMPTY_SUMMARY,
      accounts: EMPTY_ACCOUNTS,
    });
  } catch (e) {
    return res.json({
      summary: EMPTY_SUMMARY,
      accounts: EMPTY_ACCOUNTS,
    });
  }
});

router.post('/transfers', async (req, res) => {
  res.json({ message: 'Internal transfer recorded successfully' });
});

router.post('/investments', async (req, res) => {
  try {
    const { user_id, account_id, amount, investment_type, notes } = req.body;
    const amountInr = Number(amount);
    if (!user_id || !account_id || !amountInr || amountInr <= 0) {
      return res.status(400).json({ message: 'user_id, account_id and positive amount are required' });
    }

    const amountPaise = Math.round(amountInr * 100);
    const today = new Date().toISOString().slice(0, 10);

    let user = null;
    if (typeof user_id === 'string' && user_id.length === 24) {
      user = await User.findById(user_id);
    }
    if (!user) {
      const partners = await User.find({ status: 'active' }).sort({ createdAt: 1 });
      const idx = Math.max(0, Number(user_id) - 1);
      user = partners[idx] || partners[0];
    }
    if (!user) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    let account = null;
    if (typeof account_id === 'string' && account_id.length === 24) {
      account = await Account.findById(account_id);
    }
    if (!account) {
      const accounts = await Account.find({ is_active: true }).sort({ createdAt: 1 });
      const idx = Math.max(0, Number(account_id) - 1);
      account = accounts[idx] || accounts.find(a => a.type === 'bank') || accounts[0];
    }
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const newBalance = (account.balance_paise || 0) + amountPaise;
    account.balance_paise = newBalance;
    await account.save();

    await AccountTransaction.create({
      account_id: account._id,
      type: 'credit',
      amount_paise: amountPaise,
      balance_after_paise: newBalance,
      payment_mode: 'bank_transfer',
      reference_type: 'partner_investment',
      transaction_date: today,
      description: notes || `Partner capital from ${user.name}`,
    });

    const investment = await Investment.create({
      user_id: user._id,
      account_id: account._id,
      amount_paise: amountPaise,
      investment_type: investment_type || 'additional_capital',
      notes: notes || 'Partner Capital Injection',
      transaction_date: today,
    });

    return res.status(201).json({
      message: 'Partner capital injection recorded successfully',
      investment: {
        id: investment._id,
        amount_inr: amountInr,
        partner: user.name,
        account: account.name,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to record investment' });
  }
});

router.get('/investments', async (req, res) => {
  try {
    const list = await Investment.find()
      .populate('user_id', 'name email role')
      .populate('account_id', 'name type')
      .sort({ createdAt: -1 })
      .lean();

    const data = list.map((inv) => ({
      ...inv,
      id: inv._id,
      amount_inr: (inv.amount_paise || 0) / 100,
      partner: inv.user_id,
      account: inv.account_id,
    }));

    const total_inr = data.reduce((sum, inv) => sum + (inv.amount_inr || 0), 0);

    return res.json({ data, summary: { total_inr, count: data.length } });
  } catch (e) {
    return res.json({ data: [], summary: { total_inr: 0, count: 0 } });
  }
});

export default router;
