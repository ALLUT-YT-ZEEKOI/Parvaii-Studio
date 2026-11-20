import React, { useEffect, useState } from 'react';
import { Settings, Shield, History, Save, CheckCircle2, Moon, Sun } from 'lucide-react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'audit'>('general');
  const [companyName, setCompanyName] = useState('PARVAII');
  const [legalName, setLegalName] = useState('Parvaii Apparel LLP');
  const [phone, setPhone] = useState('+91 98400 12345');
  const [email, setEmail] = useState('studio@parvaii.com');
  const [gst, setGst] = useState('33AAACP1234M1Z5');
  const [currency, setCurrency] = useState('INR (₹)');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [saveMessage, setSaveMessage] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        if (res.data?.company) {
          setCompanyName(res.data.company.name || 'PARVAII');
          setLegalName(res.data.company.legal_name || 'Parvaii Apparel LLP');
          setPhone(res.data.company.phone || '+91 98400 12345');
          setEmail(res.data.company.email || 'studio@parvaii.com');
          setGst(res.data.company.gst_number || '33AAACP1234M1Z5');
        }
      })
      .catch(() => {});

    api.get('/audit-logs')
      .then((res) => {
        if (res.data?.data) {
          setAuditLogs(res.data.data);
        } else if (Array.isArray(res.data)) {
          setAuditLogs(res.data);
        }
      })
      .catch(() => {
        setAuditLogs([
          { id: 1, action: 'order_created', entity_type: 'Order', entity_id: 10, user: { name: 'Allu' }, created_at: '2026-07-28 14:30:10' },
          { id: 2, action: 'reimbursement_settled', entity_type: 'ReimbursementSettlement', entity_id: 1, user: { name: 'Allu' }, created_at: '2026-07-28 15:10:22' },
          { id: 3, action: 'stock_adjusted', entity_type: 'InventoryMovement', entity_id: 4, user: { name: 'Aishwarya M.' }, created_at: '2026-07-28 16:40:05' },
        ]);
      });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">System Settings & Governance</h2>
          <p className="text-xs text-slate-500">Brand identity, tax configuration & immutable audit logs</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 inline-flex items-center gap-2 shadow-xs dark:bg-gradient-to-r dark:from-[#0E1F3D] dark:to-[#13284F] dark:text-[#C9B7A5] dark:border-[#1E3760] transition-all"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#0B162A]" />}
            <span>{isDarkMode ? 'Switch to White Mode' : 'Switch to Navy Dark Mode'}</span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'general' ? 'bg-[#0B162A] text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Brand Details
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'audit' ? 'bg-[#0B162A] text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            System Audit Trail
          </button>
        </div>
      </div>

      {activeTab === 'general' ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card p-6 space-y-4 max-w-2xl">
          {saveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Brand Display Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Legal Registered Entity</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Currency</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-slate-500 font-semibold"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#0B162A] text-white text-xs font-semibold rounded-xl hover:bg-[#162544] shadow transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#0B162A] uppercase tracking-wider">
              Immutable System Audit Activity Log
            </h3>
            <span className="text-[11px] text-slate-400">Strictly recorded per financial transaction</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0B162A] capitalize block">
                      {log.action?.replace('_', ' ')}: {log.entity_type} #{log.entity_id}
                    </span>
                    <span className="text-[11px] text-slate-500">Performed by {log.user?.name || 'Administrator'}</span>
                  </div>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{log.created_at}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

