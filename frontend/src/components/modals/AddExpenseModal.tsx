import React, { useState } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AddExpenseModal: React.FC = () => {
  const { isAddExpenseOpen, setIsAddExpenseOpen, collections, activeCollection } = useAuth();

  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCollection, setSelectedCollection] = useState(activeCollection !== 'All Drops' ? activeCollection : 'Drop 02');
  const [categoryId, setCategoryId] = useState('1'); // Fabric
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [fundingSource, setFundingSource] = useState<'company_account' | 'personal_member'>('personal_member');
  const [companyAccountId, setCompanyAccountId] = useState('1');
  const [paidByUserId, setPaidByUserId] = useState('1'); // Allu
  const [paymentMode, setPaymentMode] = useState('upi');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAddExpenseOpen) return null;

  const categories = [
    { id: 1, name: 'Fabric' },
    { id: 2, name: 'Stitching' },
    { id: 3, name: 'Packaging' },
    { id: 4, name: 'Labels' },
    { id: 5, name: 'Transport' },
    { id: 6, name: 'Travel' },
    { id: 7, name: 'Marketing' },
    { id: 8, name: 'Website' },
    { id: 9, name: 'Courier' },
    { id: 10, name: 'Office' },
    { id: 11, name: 'Miscellaneous' },
  ];

  const members = [
    { id: 1, name: 'Allu (Managing Partner)' },
    { id: 2, name: 'Parvathy S. (Creative Director)' },
    { id: 3, name: 'Aishwarya M. (Sourcing & Production)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const catObj = categories.find(c => String(c.id) === String(categoryId));
      await api.post('/expenses', {
        expense_date: expenseDate,
        collection_id: selectedCollection,
        collection_name: selectedCollection,
        category_id: Number(categoryId),
        category_name: catObj ? catObj.name : 'Fabric',
        description: description,
        amount: Number(amount),
        funding_source: fundingSource,
        company_account_id: fundingSource === 'company_account' ? Number(companyAccountId) : null,
        paid_by_user_id: fundingSource === 'personal_member' ? Number(paidByUserId) : null,
        payment_mode: paymentMode,
        reference_number: referenceNumber,
      });

      setMessage('Expense recorded successfully!');
      setTimeout(() => {
        setIsAddExpenseOpen(false);
        setMessage('');
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error('[Add Expense Error]', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to save expense';
      setMessage(`Error: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950 text-rose-300 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B162A]">Record Brand Expense</h3>
              <p className="text-xs text-slate-500">Supports company accounts and personal member UPI spending</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddExpenseOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {message && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              message.startsWith('Error:')
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}>
              {message.startsWith('Error:') ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Funding Source Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Who Funded This Expense? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFundingSource('personal_member')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  fundingSource === 'personal_member'
                    ? 'border-[#0B162A] bg-slate-50 ring-2 ring-[#0B162A]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block text-xs font-bold text-[#0B162A]">Personal Member UPI</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">Creates pending reimbursement payable</span>
              </button>

              <button
                type="button"
                onClick={() => setFundingSource('company_account')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  fundingSource === 'company_account'
                    ? 'border-[#0B162A] bg-slate-50 ring-2 ring-[#0B162A]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block text-xs font-bold text-[#0B162A]">Company Account</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">Directly deducts Bank / Cash Box</span>
              </button>
            </div>
          </div>

          {/* Conditional: Member Selector or Account Selector */}
          {fundingSource === 'personal_member' ? (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Accounting Rule: Company Bank balance is NOT deducted</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Select Partner Who Paid Out-of-Pocket:
                </label>
                <select
                  value={paidByUserId}
                  onChange={(e) => setPaidByUserId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Account to Deduct *
              </label>
              <select
                value={companyAccountId}
                onChange={(e) => setCompanyAccountId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="1">HDFC Bank Current A/c (Current: ₹12,500)</option>
                <option value="2">Studio Cash Box (Current: ₹3,743)</option>
              </select>
            </div>
          )}

          {/* Drop / Collection Assignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Expense to Drop / Collection *
            </label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-[#0B162A] focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
            >
              {collections.map((col) => (
                <option key={col.id || col._id || col.name} value={col.name}>
                  {col.name} ({col.subtitle || 'Active Drop'})
                </option>
              ))}
              <option value="General Brand Operations">General Brand Operations (Non-drop)</option>
            </select>
          </div>

          {/* Category & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Purchased 10m rayon fabric from weaver for sample batch"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
            />
          </div>

          {/* Date & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Date
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                UPI / Bill Reference #
              </label>
              <input
                type="text"
                placeholder="e.g. UPI/2026/0912"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0B162A] hover:bg-[#162544] rounded-xl shadow transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

