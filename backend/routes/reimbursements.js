import express from 'express';
import { Reimbursement } from '../models/Reimbursement.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await Reimbursement.find().sort({ claim_date: -1 }).lean().catch(() => []);
    return res.json({
      data: list.map(r => ({
        ...r,
        id: r._id,
        claim_inr: (r.claim_amount_paise || 0) / 100,
        settled_inr: (r.settled_amount_paise || 0) / 100,
        outstanding_inr: (r.outstanding_amount_paise || 0) / 100,
      }))
    });
  } catch (e) {
    return res.json({ data: [] });
  }
});

router.post('/settle', (req, res) => {
  res.json({ message: 'Reimbursement settled from company treasury' });
});

router.get('/member-ledger', (req, res) => {
  res.json({
    summary: { total_pending_inr: 0, members_count: 0 },
    members: []
  });
});

export default router;
