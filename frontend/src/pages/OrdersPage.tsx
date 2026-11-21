import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Plus, Filter, CheckCircle2, Clock, XCircle, ChevronRight, FileText, IndianRupee, Layers } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { getOrdersForDrop } from '../services/dropData';

export const OrdersPage: React.FC = () => {
  const { setIsNewOrderOpen, setIsReceivePaymentOpen, activeCollection, setActiveCollection } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter, activeCollection]);

  const loadOrders = () => {
    const params: Record<string, string> = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (activeCollection && activeCollection !== 'All Drops') params.collection_id = activeCollection;

    api.get('/orders', { params })
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setOrders(res.data.data);
        } else if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      })
      .catch(() => {
        setOrders([]);
      });
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, order_status: newStatus as any });
      }
    } catch (e) {
      // Offline fallback
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus as any } : o));
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(s) ||
      o.customer?.full_name.toLowerCase().includes(s) ||
      o.customer?.phone.includes(s)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Compact header: title + New Order */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#0B162A] leading-tight">Orders</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
            <span className="hidden sm:inline"> · Track from reservation to delivery</span>
          </p>
        </div>
        <button
          onClick={() => setIsNewOrderOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 sm:px-4 bg-[#0B162A] text-white rounded-xl text-xs font-semibold hover:bg-[#162544] shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Drop switcher — single compact row (no duplicate label) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {['Drop 01', 'Drop 02', 'All Drops'].map((drop) => (
          <button
            key={drop}
            type="button"
            onClick={() => setActiveCollection(drop)}
            className={`h-9 px-3.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              activeCollection === drop
                ? 'bg-[#0B162A] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {drop}
          </button>
        ))}
      </div>

      {/* Status tabs + search — mobile-first, no broken underline */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3 pt-3 pb-2">
          {['all', 'pending', 'processing', 'sold', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`h-9 px-3.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap shrink-0 transition-colors ${
                statusFilter === tab
                  ? 'bg-[#0B162A] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer..."
              className="w-full h-11 pl-10 pr-3 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B162A]/15 focus:border-[#0B162A]"
            />
          </div>
        </div>
      </div>

      {/* Mobile Orders Card View (Visible on phones < 768px) */}
      <div className="md:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No orders yet</p>
            <p className="text-[11px] text-slate-400 mt-1">Tap New Order to add your first sale</p>
            <button
              type="button"
              onClick={() => setIsNewOrderOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 bg-[#0B162A] text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              New Order
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-card space-y-3"
            >
              {/* Order Header: Number, Date, Status */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-[#0B162A]">
                    {order.order_number}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {order.order_date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${order.order_status === 'sold' || order.order_status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : order.order_status === 'processing'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : order.order_status === 'cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                  >
                    {order.order_status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Details with WhatsApp button */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-[#0B162A] block">
                    {order.customer?.full_name || 'Guest Customer'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {order.customer?.phone || 'No phone'}
                  </span>
                </div>
                {order.customer?.phone && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                      order.customer.phone.replace(/[^0-9]/g, '')
                    )}&text=${encodeURIComponent(
                      `Hello ${order.customer.full_name}, your PARVAII order ${order.order_number} is in progress!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    WhatsApp
                  </a>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-1 text-xs">
                {order.items?.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-700">
                    <span className="font-medium text-[11.5px] truncate max-w-[200px]">
                      {it.product_name}
                    </span>
                    <span className="font-semibold text-slate-500 text-[11px]">
                      Size: <strong className="text-slate-800">{it.size}</strong> × {it.quantity}
                    </span>
                  </div>
                )) || <span className="text-slate-400 text-xs">1 item</span>}
              </div>

              {/* Financial Summary Strip */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-semibold">Total</span>
                  <span className="text-base font-extrabold text-[#0B162A]">
                    ₹{order.total_inr?.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-semibold">Paid / Balance</span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="font-bold text-emerald-600">
                      ₹{order.received_inr?.toLocaleString() || 0}
                    </span>
                    {order.balance_inr > 0 ? (
                      <span className="px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded text-[10.5px] font-bold border border-rose-100">
                        Due ₹{order.balance_inr?.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10.5px]">✓ Paid</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Quick Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Status</span>
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="sold">Sold</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {order.balance_inr > 0 && (
                  <button
                    onClick={() => setIsReceivePaymentOpen(true)}
                    className="w-full h-10 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    Collect ₹{order.balance_inr?.toLocaleString()}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Orders Table (Visible on Desktop >= 768px) */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Ordered</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Paid / Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No orders recorded yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click "+ New Order" to record your first studio sale</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0B162A]">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {order.order_date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {order.customer?.full_name || 'Guest'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {order.customer?.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {order.items?.map((it, idx) => (
                        <span key={idx} className="block text-slate-700 font-medium">
                          {it.product_name} ({it.size}) × {it.quantity}
                        </span>
                      )) || <span className="text-slate-400">1 item</span>}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#0B162A]">
                      ₹{order.total_inr?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-600 font-semibold block">
                        ₹{order.received_inr?.toLocaleString() || 0}
                      </span>
                      {order.balance_inr > 0 ? (
                        <span className="text-rose-600 font-medium text-[11px]">
                          Due: ₹{order.balance_inr?.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Fully Paid</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-2 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="sold">Sold</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.balance_inr > 0 && (
                          <button
                            onClick={() => setIsReceivePaymentOpen(true)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-semibold"
                          >
                            + Collect ₹{order.balance_inr}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="View details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0B162A]">Order #{selectedOrder.order_number}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="text-xs space-y-2">
              <p><strong>Customer:</strong> {selectedOrder.customer?.full_name} ({selectedOrder.customer?.phone})</p>
              <p><strong>Date:</strong> {selectedOrder.order_date}</p>
              <p><strong>Shipping:</strong> {selectedOrder.shipping_address || 'Address provided on order'}</p>
              <p><strong>Courier:</strong> {selectedOrder.courier_partner || 'Pending dispatch'}</p>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold block mb-1">Items Breakdown:</span>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-50">
                    <span>{it.product_name} (Size: {it.size}) × {it.quantity}</span>
                    <span className="font-semibold">₹{it.total_price_inr}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#0B162A] text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

