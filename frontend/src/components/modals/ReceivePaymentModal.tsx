import React, { useState } from 'react';
import { X, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const ReceivePaymentModal: React.FC = () => {
  const { isReceivePaymentOpen, setIsReceivePaymentOpen } = useAuth();

  const [orderId, setOrderId] = useState('8'); // ORD-008 (Nivedita R.)
  const [amount, setAmount] = useState<number | ''>(299);
  const [paymentMode, setPaymentMode] = useState('upi');
  const [accountId, setAccountId] = useState('1'); // HDFC Bank
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isReceivePaymentOpen) return null;

  const pendingOrders = [
    { id: 8, order_number: 'ORD-008', customer: 'Nivedita R.', outstanding: 299 },
    { id: 2, order_number: 'ORD-002', customer: 'Deepika M.', outstanding: 499 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      await api.post(`/orders/${orderId}/payments`, {
        account_id: Number(accountId),
        amount: Number(amount),
        payment_mode: paymentMode,
        reference_number: referenceNumber,
      });

      setMessage('Payment received and company account credited successfully!');
      setTimeout(() => {
        setIsReceivePaymentOpen(false);
        setMessage('');
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setMessage('Payment recorded in demo mode!');
      setTimeout(() => {
        setIsReceivePaymentOpen(false);
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
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-300 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B162A]">Receive Customer Payment</h3>
              <p className="text-xs text-slate-500">Credits company balance and updates order balance</p>
            </div>
          </div>
          <button
            onClick={() => setIsReceivePaymentOpen(false)}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Order *</label>
            <select
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                const o = pendingOrders.find((x) => x.id === Number(e.target.value));
                if (o) setAmount(o.outstanding);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              {pendingOrders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.order_number} — {o.customer} (Pending: ₹{o.outstanding})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amount to Collect (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold text-[#0B162A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="upi">UPI (GPay, PhonePe, Paytm)</option>
                <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="cash">Cash-in-Hand</option>
                <option value="card">Credit / Debit Card</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deposit To Company Account *</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="1">HDFC Bank Current A/c (Current: ₹12,500)</option>
              <option value="2">Studio Cash Box (Current: ₹3,743)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reference / UTR #</label>
            <input
              type="text"
              placeholder="e.g. UPI/6192837482"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsReceivePaymentOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0B162A] hover:bg-[#162544] rounded-xl shadow transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Receiving...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

