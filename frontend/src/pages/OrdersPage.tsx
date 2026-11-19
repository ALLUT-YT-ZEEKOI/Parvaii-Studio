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
    <div className="space-y-6">
      {/* Active Drop Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9B7A5]"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing Orders For:
          </span>
          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            {activeCollection}
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            ({filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'} found)
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

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Order Management</h2>
          <p className="text-xs text-slate-500">Track life-cycle from reservation to courier delivery</p>
        </div>

        <button
          onClick={() => setIsNewOrderOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B162A] text-white rounded-xl text-xs font-semibold hover:bg-[#162544] shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pending', 'processing', 'sold', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${statusFilter === tab
                ? 'bg-[#0B162A] text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]"
          />
        </div>
      </div>

      {/* Mobile Orders Card View (Visible on phones < 768px) */}
      <div className="md:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-400 text-xs border border-slate-200">
            No orders found matching this filter.
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
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
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
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0"
                  >
                    + Collect ₹{order.balance_inr}
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

