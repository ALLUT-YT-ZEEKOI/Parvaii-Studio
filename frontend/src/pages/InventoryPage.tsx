import React, { useEffect, useState } from 'react';
import { Layers, AlertTriangle, Search, History, ArrowDown, ArrowUp } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getInventoryForDrop } from '../services/dropData';

export const InventoryPage: React.FC = () => {
  const { activeCollection, setActiveCollection } = useAuth();
  const [variants, setVariants] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [search, setSearch] = useState('');
  const [adjustModalItem, setAdjustModalItem] = useState<any | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustType, setAdjustType] = useState('adjustment');
  const [adjustNotes, setAdjustNotes] = useState('');

  useEffect(() => {
    loadInventory();
    loadMovements();
  }, [activeCollection]);

  const loadInventory = () => {
    const params: Record<string, string> = {};
    if (activeCollection && activeCollection !== 'All Drops') {
      params.collection_id = activeCollection;
    }

    api.get('/inventory', { params })
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setVariants(res.data.data);
        } else if (Array.isArray(res.data)) {
          setVariants(res.data);
        } else {
          setVariants([]);
        }
      })
      .catch(() => {
        setVariants([]);
      });
  };

  const loadMovements = () => {
    api.get('/inventory/movements')
      .then((res) => {
        if (res.data?.data) {
          setMovements(res.data.data);
        } else if (Array.isArray(res.data)) {
          setMovements(res.data);
        }
      })
      .catch(() => {
        setMovements([
          { id: 1, movement_type: 'order_reserved', quantity: -1, available_before: 2, available_after: 1, reserved_before: 0, reserved_after: 1, notes: 'Reserved for ORD-010', created_at: '2026-07-28 14:30' },
          { id: 2, movement_type: 'order_fulfilled', quantity: -1, available_before: 1, available_after: 1, reserved_before: 1, reserved_after: 0, notes: 'Order ORD-010 delivered', created_at: '2026-07-28 16:45' },
        ]);
      });
  };

  const handleQuickAdjust = async (variant: any, delta: number) => {
    const newQty = Math.max(0, (variant.available_stock || 0) + delta);
    setVariants((prev) =>
      prev.map((v) => (v.id === variant.id ? { ...v, available_stock: newQty } : v))
    );
    try {
      await api.post('/inventory/adjust', {
        product_variant_id: variant.id,
        quantity: delta,
        movement_type: 'adjustment',
        notes: delta > 0 ? 'Quick +1 stock adjustment' : 'Quick -1 stock adjustment',
      });
      loadMovements();
    } catch (e) {
      // Keep optimistic or reload
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalItem) return;

    try {
      await api.post('/inventory/adjust', {
        product_variant_id: adjustModalItem.id,
        quantity: adjustQty,
        movement_type: adjustType,
        notes: adjustNotes,
      });
      setAdjustModalItem(null);
      loadInventory();
      loadMovements();
    } catch (e) {
      setAdjustModalItem(null);
    }
  };

  const filtered = variants.filter((v) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return v.sku.toLowerCase().includes(s) || v.product?.name.toLowerCase().includes(s);
  });

  const totalStockInHand = filtered.reduce((acc, v) => acc + (v.available_stock || 0), 0);

  return (
    <div className="space-y-6">
      {/* Active Drop Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9B7A5]"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing Stock Inventory For:
          </span>
          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            {activeCollection}
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            ({totalStockInHand} pieces available across {filtered.length} variants)
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['Drop 01', 'Drop 02', 'All Drops'].map((drop) => (
            <button
              key={drop}
              type="button"
              onClick={() => setActiveCollection(drop)}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Inventory Control</h2>
          <p className="text-xs text-slate-500">Real-time Available vs Reserved stock breakdown with audit trails</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'stock' ? 'bg-[#0B162A] text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Variant Stock Levels
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'movements' ? 'bg-[#0B162A] text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Movement Audit Log
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">All Product SKUs & Sizes</span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search variant SKU..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile Variant Cards (< 768px) */}
          <div className="md:hidden divide-y divide-slate-100">
            {filtered.map((v) => (
              <div key={v.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#0B162A]">
                      {v.sku}
                    </span>
                    <span className="font-semibold text-xs text-slate-800 block">
                      {v.product?.name || 'Dress'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                    Size {v.size}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-center items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Stock in Hand</span>
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(v, -1)}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold flex items-center justify-center text-xs transition-colors"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-xs text-emerald-700 min-w-[28px]">
                        {v.available_stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(v, 1)}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-700 font-bold flex items-center justify-center text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reserved</span>
                    <span className="font-bold text-xs text-amber-600">{v.reserved_stock} pcs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Sold</span>
                    <span className="font-bold text-xs text-slate-700">{v.sold_stock} pcs</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Damaged: <strong className="text-rose-600">{v.damaged_stock || 0}</strong>
                  </span>
                  <button
                    onClick={() => setAdjustModalItem(v)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-medium text-[11px]"
                  >
                    Custom Audit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Variant Table (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Variant SKU</th>
                  <th className="py-3 px-4">Dress Name</th>
                  <th className="py-3 px-4 text-center">Size</th>
                  <th className="py-3 px-4 text-center">Stock in Hand (+ / -)</th>
                  <th className="py-3 px-4 text-center">Reserved</th>
                  <th className="py-3 px-4 text-center">Sold</th>
                  <th className="py-3 px-4 text-center">Damaged</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0B162A]">{v.sku}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{v.product?.name || 'Dress'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {v.size}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(v, -1)}
                          className="w-5 h-5 rounded-md bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200 transition-colors shadow-2xs"
                          title="Reduce 1 piece"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs text-emerald-700 px-1 min-w-[40px] text-center">
                          {v.available_stock} pcs
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(v, 1)}
                          className="w-5 h-5 rounded-md bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200 transition-colors shadow-2xs"
                          title="Add 1 piece"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-amber-600">
                      {v.reserved_stock} pcs
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {v.sold_stock} pcs
                    </td>
                    <td className="py-3 px-4 text-center text-rose-500 font-medium">
                      {v.damaged_stock || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setAdjustModalItem(v)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-medium text-[11px]"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-[#0B162A] uppercase tracking-wider">
              Immutable Inventory Movements Log
            </h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {movements.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    m.quantity < 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {m.quantity < 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-[#0B162A] capitalize block">
                      {m.movement_type?.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">{m.notes}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold block ${m.quantity < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity} pcs
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Avail: {m.available_before} → {m.available_after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-[#0B162A] mb-1">Adjust Inventory Level</h3>
            <p className="text-xs text-slate-500 mb-4">{adjustModalItem.product?.name} ({adjustModalItem.sku})</p>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Reason / Movement Type *</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="adjustment">Stock Count Adjustment (Count mismatch)</option>
                  <option value="damaged">Damaged / Stitching Defect</option>
                  <option value="returned">Customer Return Received</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Quantity Change (+ or -) *</label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Audit Note *</label>
                <textarea
                  required
                  rows={2}
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="Mandatory reason for audit log..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAdjustModalItem(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B162A] text-white font-semibold rounded-xl"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

