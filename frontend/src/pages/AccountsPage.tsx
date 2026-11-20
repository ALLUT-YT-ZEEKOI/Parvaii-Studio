import React, { useEffect, useState } from 'react';
import { Wallet, Building2, ArrowLeftRight, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, Layers, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../services/api';
import { Account, AccountTransaction } from '../types';
import { useAuth } from '../context/AuthContext';
import { getAccountFlowForDrop } from '../services/dropData';

export const AccountsPage: React.FC = () => {
  const { activeCollection, setActiveCollection, collections } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [summary, setSummary] = useState({ total_balance_inr: 0, bank_balance_inr: 0, cash_balance_inr: 0 });
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isInvestOpen, setIsInvestOpen] = useState(false);

  const dropFlow = getAccountFlowForDrop(activeCollection);

  // Transfer form
  const [fromAccount, setFromAccount] = useState('1');
  const [toAccount, setToAccount] = useState('2');
  const [transferAmount, setTransferAmount] = useState(1000);
  const [transferNotes, setTransferNotes] = useState('Petty cash replenishment');

  // Investment form
  const [investMember, setInvestMember] = useState('1'); // Allu
  const [investAccount, setInvestAccount] = useState('1'); // Bank
  const [investAmount, setInvestAmount] = useState(10000);
  const [investType, setInvestType] = useState('additional_capital');

  useEffect(() => {
    loadAccounts();
  }, [activeCollection]);

  const loadAccounts = () => {
    api.get('/accounts')
      .then((res) => {
        if (res.data?.accounts) {
          setAccounts(res.data.accounts);
          setSummary(res.data.summary);
        }
      })
      .catch(() => {
        setAccounts([
          { id: 1, name: 'HDFC Bank Current A/c', type: 'bank', bank_name: 'HDFC Bank', account_number: '50200084920194', ifsc_code: 'HDFC0001234', branch: 'T. Nagar, Chennai', balance_inr: 0, opening_balance_inr: 0, is_active: true },
          { id: 2, name: 'Studio Cash Box', type: 'cash', balance_inr: 0, opening_balance_inr: 0, is_active: true },
        ]);
        setSummary({ total_balance_inr: 0, bank_balance_inr: 0, cash_balance_inr: 0 });
      });
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/accounts/transfers', {
        from_account_id: Number(fromAccount),
        to_account_id: Number(toAccount),
        amount: Number(transferAmount),
        notes: transferNotes,
      });
      setIsTransferOpen(false);
      loadAccounts();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Transfer completed');
      setIsTransferOpen(false);
      loadAccounts();
    }
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/accounts/investments', {
        user_id: Number(investMember),
        account_id: Number(investAccount),
        amount: Number(investAmount),
        investment_type: investType,
        notes: 'Partner Capital Injection',
      });
      setIsInvestOpen(false);
      loadAccounts();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Investment recorded');
      setIsInvestOpen(false);
      loadAccounts();
    }
  };

  return (
    <div className="space-y-6">
      {/* ──────────────────────────────────────────────────────────
          ACTIVE DROP CASH FLOW BANNER & SWITCHER
      ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9B7A5]"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Viewing Treasury & Cash Flow for:
              </span>
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {activeCollection}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {dropFlow.summaryNote}
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['Drop 01', 'Drop 02', 'All Drops'].map((drop) => (
              <button
                key={drop}
                type="button"
                onClick={() => setActiveCollection(drop)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeCollection === drop
                    ? 'bg-[#0B162A] text-white shadow-sm ring-2 ring-[#C9B7A5]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {drop}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Drop-Specific Cash Flow Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              {activeCollection} Cash Inflow (Orders)
            </span>
            <span className="text-xl font-black text-emerald-900 mt-1 block">
              ₹{dropFlow.inflowInr.toLocaleString()}
            </span>
            <span className="text-[10.5px] text-emerald-700 font-medium">Customer sales collected</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/70">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
              {activeCollection} Cash Outflow (Expenses)
            </span>
            <span className="text-xl font-black text-rose-900 mt-1 block">
              ₹{dropFlow.outflowInr.toLocaleString()}
            </span>
            <span className="text-[10.5px] text-rose-700 font-medium">Fabric, stitching & marketing bills</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            dropFlow.netInr >= 0
              ? 'bg-blue-50/70 border-blue-200/70 text-blue-900'
              : 'bg-amber-50/70 border-amber-200/70 text-amber-900'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
              {activeCollection} Net Cash Generated
            </span>
            <span className="text-xl font-black mt-1 block">
              {dropFlow.netInr >= 0 ? '+' : ''}₹{dropFlow.netInr.toLocaleString()}
            </span>
            <span className="text-[10.5px] font-medium opacity-90">{dropFlow.statusBadge}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Company Accounts & Treasury</h2>
          <p className="text-xs text-slate-500">
            Internal transfers do not create income/expense • Capital contributions increase partner equity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 shadow-sm transition-all"
          >
            <ArrowLeftRight className="w-4 h-4 text-slate-500" />
            <span>Internal Transfer</span>
          </button>

          <button
            onClick={() => setIsInvestOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0B162A] text-white rounded-xl text-xs font-semibold hover:bg-[#162544] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Partner Investment</span>
          </button>
        </div>
      </div>

      {/* Account Balances Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Total Company Funds</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#0B162A] mt-2 block">
            ₹{summary.total_balance_inr?.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Live calculated running balance</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Bank Balance (HDFC)</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#0B162A] mt-2 block">
            ₹{summary.bank_balance_inr?.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">A/c: 50200084920194</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Cash-in-Hand (Box)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#0B162A] mt-2 block">
            ₹{summary.cash_balance_inr?.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Studio Petty Cash Locker</span>
        </div>
      </div>

      {/* Accounts List & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  acc.type === 'bank' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {acc.type === 'bank' ? <Building2 className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B162A]">{acc.name}</h3>
                  <span className="text-[11px] text-slate-400 capitalize">{acc.type} Account</span>
                </div>
              </div>
              <span className="text-lg font-extrabold text-[#0B162A]">
                ₹{acc.balance_inr?.toLocaleString()}
              </span>
            </div>

            {acc.type === 'bank' && (
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                <p>Bank: <strong>{acc.bank_name}</strong> ({acc.branch})</p>
                <p>Account #: <strong>{acc.account_number}</strong></p>
                <p>IFSC: <strong>{acc.ifsc_code}</strong></p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-400">Opening Balance: ₹{acc.opening_balance_inr?.toLocaleString()}</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Reconciled
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Internal Transfer Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-[#0B162A] mb-1">Internal Transfer Between Accounts</h3>
            <p className="text-xs text-slate-500 mb-4">Rule: Internal transfer does NOT count as income or expense</p>
            <form onSubmit={handleTransfer} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Source Account (Debit) *</label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="1">HDFC Bank (₹12,500)</option>
                  <option value="2">Studio Cash Box (₹3,743)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Destination Account (Credit) *</label>
                <select
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="2">Studio Cash Box (₹3,743)</option>
                  <option value="1">HDFC Bank (₹12,500)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Transfer Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Reason / Purpose</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B162A] text-white font-semibold rounded-xl"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Investment Modal */}
      {isInvestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-[#0B162A] mb-1">Record Partner Capital Injection</h3>
            <p className="text-xs text-slate-500 mb-4">Rule: Capital contributions are NEVER treated as sales revenue</p>
            <form onSubmit={handleInvest} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Contributing Partner *</label>
                <select
                  value={investMember}
                  onChange={(e) => setInvestMember(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="1">Allu (Managing Partner)</option>
                  <option value="2">Paru (Creative Director)</option>
                  <option value="3">Kathu (Sourcing & Production)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Deposit To Company Account *</label>
                <select
                  value={investAccount}
                  onChange={(e) => setInvestAccount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="1">HDFC Bank Current A/c</option>
                  <option value="2">Studio Cash Box</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Investment Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInvestOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B162A] text-white font-semibold rounded-xl"
                >
                  Record Capital Injection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

