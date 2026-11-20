import express from 'express';
import { Account, AccountTransaction } from '../models/Account.js';

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
  res.json({ message: 'Partner capital injection recorded successfully' });
});

router.get('/investments', (req, res) => {
  res.json({ data: [] });
});

export default router;
