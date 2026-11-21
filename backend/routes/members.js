import express from 'express';
import { User } from '../models/User.js';
import { Investment } from '../models/Investment.js';

const router = express.Router();

const FALLBACK_PARTNERS = [
  { id: 1, name: 'Allu', role: 'admin', title: 'Co-Founder & Chief Technology Officer (CTO)', equity_percentage: 34, email: 'allu@parvaii.com', phone: '+91 98765 00001', status: 'active', invested_inr: 15000 },
  { id: 2, name: 'Paru', role: 'partner', title: 'Co-Founder & Creative Director', equity_percentage: 33, email: 'paru@parvaii.com', phone: '+91 98765 00002', status: 'active', invested_inr: 15000 },
  { id: 3, name: 'Kathu', role: 'partner', title: 'Co-Founder & Social Media Manager', equity_percentage: 33, email: 'kathu@parvaii.com', phone: '+91 98765 00003', status: 'active', invested_inr: 15000 },
];

function shapeMember(user, investedInr = 0) {
  return {
    id: user._id || user.id,
    title: user.title,
    equity_percentage: user.equity_percentage ?? 0,
    status: user.status || 'active',
    invested_inr: investedInr,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}

router.get('/', async (req, res) => {
  try {
    const users = await User.find({ status: { $ne: 'inactive' } })
      .select('-password')
      .sort({ createdAt: 1 })
      .lean();

    if (!users.length) {
      const members = FALLBACK_PARTNERS.map((p) => shapeMember(p, p.invested_inr));
      const total_invested_inr = members.reduce((s, m) => s + (m.invested_inr || 0), 0);
      return res.json({ members, summary: { total_invested_inr, partners_count: members.length } });
    }

    const investments = await Investment.aggregate([
      { $group: { _id: '$user_id', total_paise: { $sum: '$amount_paise' } } },
    ]);
    const investedByUser = new Map(
      investments.map((row) => [String(row._id), (row.total_paise || 0) / 100])
    );

    const members = users.map((u) =>
      shapeMember(u, investedByUser.get(String(u._id)) || 0)
    );
    const total_invested_inr = members.reduce((s, m) => s + (m.invested_inr || 0), 0);

    return res.json({
      members,
      summary: { total_invested_inr, partners_count: members.length },
    });
  } catch (e) {
    const members = FALLBACK_PARTNERS.map((p) => shapeMember(p, p.invested_inr));
    return res.json({
      members,
      summary: { total_invested_inr: 45000, partners_count: members.length },
    });
  }
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Partner updated' });
});

export default router;
