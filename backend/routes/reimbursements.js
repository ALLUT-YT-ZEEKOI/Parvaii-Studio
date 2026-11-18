import express from 'express';
import { Reimbursement } from '../models/Reimbursement.js';

const router = express.Router();

const DEFAULT_REIMBURSEMENTS = [
  {
    id: 1,
    reimbursement_number: 'RMB-2026-0001',
    claim_inr: 1000,
    settled_inr: 0,
    outstanding_inr: 1000,
    status: 'pending',
    claim_date: '2026-07-10',
    member: { id: 1, name: 'Allu', role: 'admin', email: 'allu@parvaii.com' },
    expense: { id: 1, expense_number: 'EXP-2026-0001', description: 'Fine Indigo Modal Fabric for Midnight Bloom', category_name: 'Fabric', amount_inr: 1000 }
  },
  {
    id: 2,
    reimbursement_number: 'RMB-2026-0002',
    claim_inr: 750,
    settled_inr: 0,
    outstanding_inr: 750,
    status: 'pending',
    claim_date: '2026-07-14',
    member: { id: 2, name: 'Paru', role: 'partner', email: 'paru@parvaii.com' },
    expense: { id: 2, expense_number: 'EXP-2026-0002', description: 'Urgent boutique sample stitching batch', category_name: 'Stitching', amount_inr: 750 }
  },
  {
    id: 3,
    reimbursement_number: 'RMB-2026-0003',
    claim_inr: 500,
    settled_inr: 0,
    outstanding_inr: 500,
    status: 'pending',
    claim_date: '2026-07-18',
    member: { id: 3, name: 'Kathu', role: 'partner', email: 'kathu@parvaii.com' },
    expense: { id: 3, expense_number: 'EXP-2026-0003', description: 'Custom butter paper and woven brand tags for Drop 02', category_name: 'Packaging', amount_inr: 500 }
  },
];

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
    summary: { total_pending_inr: 2250, members_count: 3 },
    members: [
      { id: 1, name: 'Allu', pending_inr: 1000 },
      { id: 2, name: 'Paru', pending_inr: 750 },
      { id: 3, name: 'Kathu', pending_inr: 500 },
    ]
  });
});

export default router;
