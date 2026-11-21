import express from 'express';

const router = express.Router();

const PARTNERS = [
  { id: 1, name: 'Allu', role: 'admin', title: 'Co-Founder & Chief Technology Officer (CTO)', equity_percentage: 34, email: 'allu@parvaii.com', phone: '+91 98765 00001', status: 'active' },
  { id: 2, name: 'Paru', role: 'partner', title: 'Co-Founder & Creative Director', equity_percentage: 33, email: 'paru@parvaii.com', phone: '+91 98765 00002', status: 'active' },
  { id: 3, name: 'Kathu', role: 'partner', title: 'Co-Founder & Social Media Manager', equity_percentage: 33, email: 'kathu@parvaii.com', phone: '+91 98765 00003', status: 'active' },
];

router.get('/', (req, res) => {
  res.json({ members: PARTNERS });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Partner updated' });
});

export default router;
