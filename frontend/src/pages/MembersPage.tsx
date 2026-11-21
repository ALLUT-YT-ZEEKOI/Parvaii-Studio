import React, { useEffect, useState } from 'react';
import { UserCheck, Shield, Mail, Phone, Plus, Percent } from 'lucide-react';
import { api } from '../services/api';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/members')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMembers(res.data);
        }
      })
      .catch(() => {
        // Fallback 3 partners: Allu, Paru, Kathu
        setMembers([
          {
            id: 1,
            title: 'Co-Founder & Chief Technology Officer (CTO)',
            equity_percentage: 34.0,
            status: 'active',
            user: { name: 'Allu', email: 'allu@parvaii.com', phone: '+91 98765 00001', role: 'admin' },
            role: { name: 'Admin' }
          },
          {
            id: 2,
            title: 'Co-Founder & Creative Director',
            equity_percentage: 33.0,
            status: 'active',
            user: { name: 'Paru', email: 'paru@parvaii.com', phone: '+91 98765 00002', role: 'partner' },
            role: { name: 'Partner' }
          },
          {
            id: 3,
            title: 'Co-Founder & Social Media Manager',
            equity_percentage: 33.0,
            status: 'active',
            user: { name: 'Kathu', email: 'kathu@parvaii.com', phone: '+91 98765 00003', role: 'partner' },
            role: { name: 'Partner' }
          }
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Brand Partners & Governance</h2>
          <p className="text-xs text-slate-500">Three founding members with role-based access and equity shares</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-card space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0B162A] text-white flex items-center justify-center font-bold text-base shadow">
                {m.user?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B162A]">{m.user?.name}</h3>
                <span className="text-xs text-[#C9B7A5] font-semibold">{m.title}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">System Role:</span>
                <span className="font-bold text-[#0B162A] capitalize">{m.user?.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Equity Share:</span>
                <span className="font-bold text-emerald-600">{m.equity_percentage}%</span>
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
                <span>{m.user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{m.user?.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

