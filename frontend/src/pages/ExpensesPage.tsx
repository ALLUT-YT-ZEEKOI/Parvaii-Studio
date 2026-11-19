import React, { useEffect, useState } from 'react';
import { CreditCard, Plus, Search, Filter, Ban, CheckCircle2, Layers } from 'lucide-react';
import { api } from '../services/api';
import { Expense } from '../types';
import { useAuth } from '../context/AuthContext';
import { getExpensesForDrop } from '../services/dropData';

export const ExpensesPage: React.FC = () => {
  const { setIsAddExpenseOpen, activeCollection, setActiveCollection } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fundingFilter, setFundingFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadExpenses();
  }, [fundingFilter, activeCollection]);

  const loadExpenses = () => {
    const params: Record<string, string> = {};
    if (fundingFilter !== 'all') params.funding_source = fundingFilter;
    if (activeCollection && activeCollection !== 'All Drops') params.collection_id = activeCollection;

    api.get('/expenses', { params })
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setExpenses(res.data.data);
        } else if (Array.isArray(res.data)) {
          setExpenses(res.data);
        } else {
          setExpenses([]);
        }
      })
      .catch(() => {
        setExpenses([]);
      });
  };

  const handleCancelExpense = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this expense? If company-funded, funds will be restored to bank balance.')) return;
    try {
      await api.post(`/expenses/${id}/cancel`);
      loadExpenses();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Expense cancelled');
      loadExpenses();
    }
  };

  const filtered = expenses.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return e.description.toLowerCase().includes(s) || e.expense_number.toLowerCase().includes(s) || e.category_name.toLowerCase().includes(s);
  });

  const totalFilteredPaise = filtered.reduce((acc, curr) => acc + (curr.amount_inr || 0), 0);

  return (
    <div className="space-y-6">
      {/* Active Drop Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9B7A5]"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing Expenses For:
          </span>
          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            {activeCollection}
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (₹{totalFilteredPaise.toLocaleString()} across {filtered.length} entries)
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['Drop 01', 'Drop 02', 'All Drops'].map((drop) => (
            <button
              key={drop}
              type="button"
              onClick={() => setActiveCollection(drop)}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${activeCollection === drop
                ? 'bg-[#0B162A] text-white shadow-sm ring-2 ring-[#C9B7A5]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
            >
              {drop}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Expense Management</h2>
          <p className="text-xs text-slate-500">Track company disbursements and out-of-pocket partner spending</p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B162A] text-white rounded-xl text-xs font-semibold hover:bg-[#162544] shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Expenses' },
            { id: 'company_account', label: 'Company Bank / Cash' },
            { id: 'personal_member', label: 'Member UPI (Pending Reimbursement)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFundingFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${fundingFilter === tab.id
                ? 'bg-[#0B162A] text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expense description, #..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile Expenses Cards View (Visible on phones < 768px) */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-400 text-xs border border-slate-200">
            No expenses found matching this filter.
          </div>
        ) : (
          filtered.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-card space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#0B162A]">
                    {exp.expense_number}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {exp.category_name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {exp.expense_date}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-800">
                {exp.description}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-semibold">Funding Source</span>
                  {exp.funding_source === 'personal_member' ? (
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Paid by {exp.paid_by_member?.name || 'Member'}
                    </span>
                  ) : (
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Company Account
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-semibold">Amount</span>
                  <span className="text-base font-extrabold text-[#0B162A]">
                    ₹{exp.amount_inr?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-semibold capitalize ${exp.status === 'cancelled'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                >
                  {exp.status}
                </span>

                {exp.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelExpense(exp.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Cancel Expense
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Expenses Table (Visible on Desktop >= 768px) */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                <th className="py-3 px-4">Expense #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Funding Source</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No expenses recorded yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Expense" to record production or operational costs</p>
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0B162A]">{exp.expense_number}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{exp.expense_date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-semibold bg-indigo-50 text-indigo-700">
                        {exp.category_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-[260px]">
                      {exp.description}
                    </td>
                    <td className="py-3 px-4">
                      {exp.funding_source === 'personal_member' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Paid by {exp.paid_by_member?.name || 'Member'}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">Company Account</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0B162A]">
                      ₹{exp.amount_inr?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          exp.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {exp.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelExpense(exp.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Cancel Expense (Safe Reversal)"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

