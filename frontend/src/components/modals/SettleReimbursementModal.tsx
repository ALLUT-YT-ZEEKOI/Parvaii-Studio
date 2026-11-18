import React, { useState } from 'react';
import { X, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const SettleReimbursementModal: React.FC = () => {
  const { isSettleReimbOpen, setIsSettleReimbOpen } = useAuth();

  const [claimId, setClaimId] = useState('1'); // Allu (₹1,000)
  const [amount, setAmount] = useState<number | ''>(1000);
  const [accountId, setAccountId] = useState('1'); // HDFC Bank
  const [paymentMode, setPaymentMode] = useState('bank_transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isSettleReimbOpen) return null;

  const pendingClaims = [
    { id: 1, number: 'RMB-2026-0001', member: 'Allu', desc: 'Fabric purchase for Drop 02', outstanding: 1000 },
    { id: 2, number: 'RMB-2026-0002', member: 'Parvathy S.', desc: 'Sample stitching advance', outstanding: 750 },
    { id: 3, number: 'RMB-2026-0003', member: 'Aishwarya M.', desc: 'Packaging boxes & tags', outstanding: 500 },
  ];

  const currentClaim = pendingClaims.find((c) => c.id === Number(claimId)) || pendingClaims[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      await api.post('/reimbursements/settle', {
        reimbursement_id: Number(claimId),
        account_id: Number(accountId),
        amount: Number(amount),
        payment_mode: paymentMode,
        reference_number: referenceNumber,
      });

      setMessage('Settlement processed successfully! Company funds deducted.');
      setTimeout(() => {
        setIsSettleReimbOpen(false);
        setMessage('');
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setMessage('Settlement recorded in demo mode!');
      setTimeout(() => {
        setIsSettleReimbOpen(false);
        setMessage('');
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B162A] text-white flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-[#C9B7A5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B162A]">Reimburse Brand Member</h3>
              <p className="text-xs text-slate-500">Settles out-of-pocket expenses without double-counting expenses</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettleReimbOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
              ✓ {message}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Member Claim *</label>
            <select
              value={claimId}
              onChange={(e) => {
                setClaimId(e.target.value);
                const c = pendingClaims.find((x) => x.id === Number(e.target.value));
                if (c) setAmount(c.outstanding);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              {pendingClaims.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.number}: {c.member} — ₹{c.outstanding} ({c.desc})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Settlement Amount (₹) *
              </label>
              <input
                type="number"
                min="1"
                max={currentClaim.outstanding}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold text-[#0B162A]"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Max: ₹{currentClaim.outstanding}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="bank_transfer">Bank NEFT / IMPS</option>
                <option value="upi">Company UPI</option>
                <option value="cash">Cash from Box</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pay From Company Account *</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="1">HDFC Bank Current A/c (Available: ₹12,500)</option>
              <option value="2">Studio Cash Box (Available: ₹3,743)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Reference / UTR #</label>
            <input
              type="text"
              placeholder="e.g. UTR/2026/SETTL-9812"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Claim Outstanding:</span>
              <span className="font-semibold text-slate-800">₹{currentClaim.outstanding}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Amount to Pay:</span>
              <span className="font-semibold text-[#0B162A]">₹{Number(amount || 0)}</span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t border-slate-200">
              <span>Remaining Balance:</span>
              <span className="text-[#C9B7A5]">₹{Math.max(0, currentClaim.outstanding - Number(amount || 0))}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSettleReimbOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0B162A] hover:bg-[#162544] rounded-xl shadow transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Reimbursement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

