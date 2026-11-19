import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const NewOrderModal: React.FC = () => {
  const { isNewOrderOpen, setIsNewOrderOpen, activeCollection } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('1'); // Midnight Bloom Top (XS)
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [receivingAccount, setReceivingAccount] = useState('1'); // HDFC Bank
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isNewOrderOpen) return null;

  const productsList = [
    { id: 1, name: 'Midnight Bloom Top (XS)', price: 499 },
    { id: 2, name: 'Midnight Bloom Top (S)', price: 499 },
    { id: 3, name: 'Midnight Bloom Top (M)', price: 499 },
    { id: 4, name: 'Midnight Bloom Top (L)', price: 499 },
    { id: 5, name: 'Midnight Bloom Top (XL)', price: 499 },
    { id: 6, name: 'Floral Dress (S)', price: 299 },
    { id: 7, name: 'Floral Dress (M)', price: 299 },
    { id: 8, name: 'Floral Dress (L)', price: 299 },
    { id: 9, name: 'Basic Kurti (M)', price: 399 },
    { id: 10, name: 'Basic Kurti (L)', price: 399 },
  ];

  const currentItem = productsList.find((p) => p.id === Number(selectedVariantId)) || productsList[0];
  const subtotal = currentItem.price * quantity;
  const orderTotal = Math.max(0, subtotal - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await api.post('/orders', {
        collection_name: activeCollection && activeCollection !== 'All Drops' ? activeCollection : 'Drop 01',
        total_amount_inr: orderTotal,
        received_inr: advanceAmount,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        items: [
          {
            product_variant_id: selectedVariantId,
            product_name: currentItem.name,
            size: currentItem.name.includes('(L)') ? 'L' : (currentItem.name.includes('(M)') ? 'M' : 'S'),
            quantity: quantity,
            unit_price_inr: currentItem.price,
            total_price_inr: subtotal,
          },
        ],
        discount: discount,
        initial_payment_amount: advanceAmount,
        receiving_account_id: advanceAmount > 0 ? Number(receivingAccount) : null,
      });

      setSuccessMessage('Order created successfully!');
      setTimeout(() => {
        setIsNewOrderOpen(false);
        setSuccessMessage('');
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error('[New Order Error]', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to place order';
      setSuccessMessage(`Error: ${errMsg}`);
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
            <div className="w-8 h-8 rounded-lg bg-[#0B162A] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C9B7A5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B162A]">New Customer Order</h3>
              <p className="text-xs text-slate-500">Auto-reserves inventory and creates customer profile</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewOrderOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
              ✓ {successMessage}
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Shalini Roy"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shipping Address
            </label>
            <textarea
              rows={2}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Flat, street, city, pin code..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
            />
          </div>

          {/* Product Selection */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-[#0B162A] uppercase tracking-wider">
              Order Items
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Product & Variant</label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  {productsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 text-slate-600">
              <span>Item Subtotal:</span>
              <span className="font-bold text-[#0B162A]">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Pricing & Advance Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Advance Paid (₹)
              </label>
              <input
                type="number"
                min="0"
                max={orderTotal}
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {advanceAmount > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receiving Account
              </label>
              <select
                value={receivingAccount}
                onChange={(e) => setReceivingAccount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="1">HDFC Bank Current A/c (Balance: ₹12,500)</option>
                <option value="2">Studio Cash Box (Balance: ₹3,743)</option>
              </select>
            </div>
          )}

          {/* Total Summary */}
          <div className="p-3.5 bg-[#0B162A] text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Order Payable</span>
              <span className="text-lg font-bold text-white">₹{orderTotal.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Outstanding</span>
              <span className="text-sm font-semibold text-[#C9B7A5]">
                ₹{(orderTotal - advanceAmount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsNewOrderOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0B162A] hover:bg-[#162544] rounded-xl shadow transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Order & Reserve Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

