import React, { useEffect, useState } from 'react';
import { Mail, Phone, Wallet } from 'lucide-react';
import { api } from '../services/api';

const FALLBACK_MEMBERS = [
  {
    id: 1,
    title: 'Co-Founder & Chief Technology Officer (CTO)',
    equity_percentage: 34.0,
    status: 'active',
    invested_inr: 15000,
    user: { name: 'Allu', email: 'allu@parvaii.com', phone: '+91 98765 00001', role: 'admin' },
  },
  {
    id: 2,
    title: 'Co-Founder & Creative Director',
    equity_percentage: 33.0,
    status: 'active',
    invested_inr: 15000,
    user: { name: 'Paru', email: 'paru@parvaii.com', phone: '+91 98765 00002', role: 'partner' },
  },
  {
    id: 3,
    title: 'Co-Founder & Social Media Manager',
    equity_percentage: 33.0,
    status: 'active',
    invested_inr: 15000,
    user: { name: 'Kathu', email: 'kathu@parvaii.com', phone: '+91 98765 00003', role: 'partner' },
  },
];

const formatInr = (n: number) =>
  `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);

  useEffect(() => {
    api.get('/members')
      .then((res) => {
        const list = Array.isArray(res.data?.members)
          ? res.data.members
          : Array.isArray(res.data)
            ? res.data
            : [];

        if (list.length > 0) {
          setMembers(list);
          const summaryTotal = res.data?.summary?.total_invested_inr;
          setTotalInvested(
            typeof summaryTotal === 'number'
              ? summaryTotal
              : list.reduce((s: number, m: any) => s + (Number(m.invested_inr) || 0), 0)
          );
        } else {
          setMembers(FALLBACK_MEMBERS);
          setTotalInvested(45000);
        }
      })
      .catch(() => {
        setMembers(FALLBACK_MEMBERS);
        setTotalInvested(45000);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Brand Partners & Governance</h2>
          <p className="text-xs text-slate-500">Three founding members with role-based access and equity shares</p>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 m-0">Total Investment</p>
          <p className="text-lg font-bold text-[#0B162A] m-0 mt-0.5">{formatInr(totalInvested)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-card space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0B162A] text-white flex items-center justify-center font-bold text-base shadow">
                {(m.user?.name || m.name || '?').charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B162A]">{m.user?.name || m.name}</h3>
                <span className="text-xs text-[#C9B7A5] font-semibold">{m.title}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">System Role:</span>
                <span className="font-bold text-[#0B162A] capitalize">{m.user?.role || m.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Equity Share:</span>
                <span className="font-bold text-emerald-600">{m.equity_percentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Capital Invested:</span>
                <span className="font-bold text-[#0B162A] flex items-center gap-1">
                  <Wallet className="w-3 h-3 text-[#C9B7A5]" />
                  {formatInr(m.invested_inr || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  {m.status}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>{m.user?.email || m.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{m.user?.phone || m.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
