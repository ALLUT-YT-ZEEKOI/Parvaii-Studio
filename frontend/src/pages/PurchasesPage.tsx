import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Search, Building2, Phone, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';
import { Purchase, Supplier } from '../types';
import { useAuth } from '../context/AuthContext';

export const PurchasesPage: React.FC = () => {
  const { setIsAddPurchaseOpen } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [activeTab, setActiveTab] = useState<'purchases' | 'suppliers'>('purchases');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPurchases();
    loadSuppliers();
  }, []);

  const loadPurchases = () => {
    api.get('/purchases')
      .then((res) => {
        if (res.data?.data) {
          setPurchases(res.data.data);
        } else if (Array.isArray(res.data)) {
          setPurchases(res.data);
        }
      })
      .catch(() => {
        setPurchases([
          {
            id: 1,
            purchase_number: 'PUR-2026-0001',
            supplier_id: 1,
            purchase_date: '2026-07-04',
            total_inr: 4500,
            paid_inr: 0,
            balance_inr: 4500,
            payment_status: 'unpaid',
            payment_source: 'credit',
            status: 'received',
            supplier: { id: 1, name: 'Heritage Weaves & Mills', city: 'Surat', outstanding_payable_inr: 4500 },
            items: [{ id: 1, purchase_id: 1, material_type: 'fabric', item_name: 'Modal Indigo Print Fabric', unit: 'meters', quantity: 25, total_amount_inr: 4500 }]
          },
          {
            id: 2,
            purchase_number: 'PUR-2026-0002',
            supplier_id: 2,
            purchase_date: '2026-07-12',
            total_inr: 3200,
            paid_inr: 3200,
            balance_inr: 0,
            payment_status: 'paid',
            payment_source: 'company_account',
            status: 'received',
            supplier: { id: 2, name: 'Bloom Tailoring Atelier', city: 'Chennai', outstanding_payable_inr: 0 },
            items: [{ id: 2, purchase_id: 2, material_type: 'stitching', item_name: 'Sample Top Stitching Batch', unit: 'pieces', quantity: 15, total_amount_inr: 3200 }]
          }
        ]);
      });
  };

  const loadSuppliers = () => {
    api.get('/suppliers')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setSuppliers(res.data);
        }
      })
      .catch(() => {
        setSuppliers([
          { id: 1, name: 'Heritage Weaves & Mills', contact_person: 'Ramesh Kumar', phone: '+91 94433 11223', city: 'Surat', outstanding_payable_inr: 4500, purchases_count: 3 },
          { id: 2, name: 'Bloom Tailoring Atelier', contact_person: 'Meenakshi Amma', phone: '+91 98410 44556', city: 'Chennai', outstanding_payable_inr: 0, purchases_count: 5 },
          { id: 3, name: 'EcoPack Boxes & Prints', contact_person: 'Vikram Shah', phone: '+91 97234 88990', city: 'Bengaluru', outstanding_payable_inr: 1200, purchases_count: 2 },
        ]);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Purchases & Raw Materials</h2>
          <p className="text-xs text-slate-500">Fabric, stitching, custom packaging bills and supplier balances</p>
        </div>

        <button
          onClick={() => setIsAddPurchaseOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B162A] text-white rounded-xl text-xs font-semibold hover:bg-[#162544] shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Bill</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
            activeTab === 'purchases' ? 'bg-[#0B162A] text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Procurement Bills
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
            activeTab === 'suppliers' ? 'bg-[#0B162A] text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Supplier Ledger (Payables)
        </button>
      </div>

      {activeTab === 'purchases' ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Bill #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Items / Material</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Source</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0B162A]">{p.purchase_number}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{p.purchase_date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.supplier?.name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {p.items?.map((it, idx) => (
                        <span key={idx} className="block">
                          {it.item_name} ({it.quantity} {it.unit})
                        </span>
                      )) || '1 item'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0B162A]">₹{p.total_inr?.toLocaleString()}</td>
                    <td className="py-3 px-4 capitalize text-slate-600 font-medium">
                      {p.payment_source?.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          p.payment_status === 'paid'
                            ? 'bg-status-sold-bg text-status-sold-text'
                            : 'bg-status-cancelled-bg text-status-cancelled-text'
                        }`}
                      >
                        {p.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0B162A]">{s.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {s.city}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Contact: <strong>{s.contact_person || 'N/A'}</strong></p>
                <p>Phone: {s.phone || 'N/A'}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Outstanding Payable</span>
                  <span className={`font-bold ${s.outstanding_payable_inr > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ₹{s.outstanding_payable_inr?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

