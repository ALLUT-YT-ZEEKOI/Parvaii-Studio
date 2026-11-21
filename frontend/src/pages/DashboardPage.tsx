import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Layers,
  BarChart2,
  Building2,
  Users,
  CreditCard,
  ArrowUpRight,
  Cake,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Pencil,
} from 'lucide-react';
import { EditDropModal } from '../components/modals/EditDropModal';
import { Collection } from '../types';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api, initialDashboardData, getDashboardDataForDrop } from '../services/api';
import { DashboardData } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    activeCollection,
    setActiveCollection,
    collections,
    dateRange,
    setIsNewOrderOpen,
    setIsAddExpenseOpen,
    setIsAddDropOpen,
  } = useAuth();

  const [data, setData] = useState<DashboardData>(() => getDashboardDataForDrop(activeCollection));
  const [loading, setLoading] = useState(false);
  const [editingDrop, setEditingDrop] = useState<Collection | null>(null);

  useEffect(() => {
    // Immediately display the drop's synchronized dataset
    setData(getDashboardDataForDrop(activeCollection));
    setLoading(true);

    let startDate: string | undefined;
    let endDate: string | undefined;

    if (dateRange.includes('Jul 1')) {
      startDate = '2026-07-01';
      endDate = '2026-07-31';
    } else if (dateRange.includes('Last 30 Days')) {
      startDate = '2026-07-01';
      endDate = '2026-07-31';
    } else if (dateRange.includes('This Month')) {
      startDate = '2026-11-01';
      endDate = '2026-11-30';
    } else if (dateRange.includes('Full Year')) {
      startDate = '2026-01-01';
      endDate = '2026-12-31';
    }

    const colParam = activeCollection === 'All Drops' ? undefined : activeCollection;

    // Fetch live metrics from Laravel backend
    api.get('/dashboard', {
      params: {
        collection_id: colParam,
        start_date: startDate,
        end_date: endDate,
      },
    })
      .then((res) => {
        if (res.data && res.data.kpis) {
          setData(res.data);
        }
      })
      .catch(() => {
        // Fallback to active drop authentic dataset
        setData(getDashboardDataForDrop(activeCollection));
      })
      .finally(() => setLoading(false));
  }, [activeCollection, dateRange]);

  // Donut chart colors matching reference
  const donutColors = {
    sold: '#2563EB',       // Blue
    processing: '#F59E0B', // Amber
    pending: '#FCD34D',    // Gold
    cancelled: '#F87171',  // Red
  };

  const donutData = [
    { name: 'Sold', value: data.order_status?.breakdown?.sold ?? 0, color: donutColors.sold },
    { name: 'Processing', value: data.order_status?.breakdown?.processing ?? 0, color: donutColors.processing },
    { name: 'Pending', value: data.order_status?.breakdown?.pending ?? 0, color: donutColors.pending },
    { name: 'Cancelled', value: data.order_status?.breakdown?.cancelled ?? 0, color: donutColors.cancelled },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ──────────────────────────────────────────────────────────
          DEDICATED GLOBAL DROP SELECTION & ISOLATION HUB
      ────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-white via-slate-50/70 to-white p-3.5 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs sm:text-[13px] font-bold text-[#0B162A] tracking-tight">
                Active Drop: <span className="text-purple-700 font-extrabold">{activeCollection}</span>
              </span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200/60 uppercase tracking-wide">
                Synced Across All Pages
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Selecting a drop switches the entire software (Dashboard, Stock, Expenses, Balance & Cash, Orders) to this drop.
            </p>
          </div>

          {/* + Add Next Drop button */}
          <button
            onClick={() => setIsAddDropOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0B162A] text-white rounded-xl text-xs font-bold hover:bg-[#162544] shadow-sm transition-all shrink-0 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9B7A5]" />
            <span>+ Add Next Drop</span>
          </button>
        </div>

        {/* Drop cards — select + edit name/season/theme */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
          {(collections.length
            ? collections
            : [
                { id: 'drop-01', name: 'Drop 01', subtitle: 'Ethereal Dawn', season: 'Summer 2026', code: 'DROP-01', status: 'active' },
                { id: 'drop-02', name: 'Drop 02', subtitle: 'Midnight Bloom', season: 'Monsoon 2026', code: 'DROP-02', status: 'active' },
              ] as Collection[]
          ).map((c) => {
            const isSelected = activeCollection === c.name;
            const seasonTag = (c.category || c.season || 'Drop').split(/[\s/]/)[0];
            return (
              <div
                key={c.id || c._id || c.name}
                className={`p-2.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0B162A] text-white border-[#0B162A] shadow-md ring-2 ring-[#C9B7A5]'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveCollection(c.name)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between w-full gap-1">
                    <span className="text-xs font-extrabold flex items-center gap-1.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-[#C9B7A5]' : 'bg-slate-400'}`} />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span
                      className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                        isSelected ? 'bg-white/20 text-[#C9B7A5]' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {seasonTag}
                    </span>
                  </div>
                  {c.subtitle ? (
                    <p className={`mt-1 text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {c.subtitle}
                    </p>
                  ) : null}
                  <div className="mt-1.5 pt-1.5 border-t border-slate-100/20 text-[10.5px]">
                    <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                      {isSelected ? data.kpis.stock_in_hand_pieces : 0} Pcs Stock •{' '}
                      <strong className={isSelected ? 'text-white' : 'text-slate-900'}>
                        ₹{isSelected ? Math.round(data.kpis.total_sales_inr).toLocaleString() : '0'} Sales
                      </strong>
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  title="Edit drop"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingDrop(c);
                  }}
                  className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold ${
                    isSelected ? 'text-[#C9B7A5] hover:text-white' : 'text-slate-500 hover:text-[#0B162A]'
                  }`}
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setActiveCollection('All Drops')}
            className={`p-2.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
              activeCollection === 'All Drops'
                ? 'bg-[#0B162A] text-white border-[#0B162A] shadow-md ring-2 ring-[#C9B7A5]'
                : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-extrabold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                All Drops
              </span>
              <span
                className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  activeCollection === 'All Drops' ? 'bg-white/20 text-blue-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                Combined
              </span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-100/20 text-[10.5px]">
              <span className={activeCollection === 'All Drops' ? 'text-slate-300' : 'text-slate-500'}>
                {activeCollection === 'All Drops' ? data.kpis.stock_in_hand_pieces : 0} Pcs Stock •{' '}
                <strong className={activeCollection === 'All Drops' ? 'text-white' : 'text-slate-900'}>
                  ₹{activeCollection === 'All Drops' ? Math.round(data.kpis.total_sales_inr).toLocaleString() : '0'} Sales
                </strong>
              </span>
            </div>
          </button>
        </div>
      </div>
      {/* ──────────────────────────────────────────────────────────
          MOBILE APP HERO & WALLET (Visible on mobile screens < 640px)
      ────────────────────────────────────────────────────────── */}
      <div className="sm:hidden space-y-3.5">
        {/* Luxury Navy Digital Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B162A] via-[#122340] to-[#0B162A] p-5 text-white shadow-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-[#C9B7A5]">
            <span className="font-serif tracking-widest uppercase text-[11px] font-bold">
              PARVAII Atelier
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/10 font-semibold">
              Live Balance
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] text-slate-400 block font-medium">Company Balance Amount</span>
            <span className="text-3xl font-serif font-bold text-white tracking-tight">
              ₹{data.kpis?.company_balance_inr?.toLocaleString() || '16,243'}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11.5px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Bank: <strong className="text-white">₹{(data.kpis?.bank_balance_inr ?? 0).toLocaleString()}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Cash: <strong className="text-white">₹{(data.kpis?.cash_balance_inr ?? 0).toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* 4 Mobile Quick Action App Buttons */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10.5px] font-bold text-slate-700 leading-tight">+ Order</span>
          </button>

          <Link
            to="/inventory"
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10.5px] font-bold text-slate-700 leading-tight">Stock +/-</span>
          </Link>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10.5px] font-bold text-slate-700 leading-tight">+ Expense</span>
          </button>

          <Link
            to="/customers"
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10.5px] font-bold text-slate-700 leading-tight">Clients</span>
          </Link>
        </div>

        {/* 4 Summary Stat Chips (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Sales</span>
            <span className="text-lg font-extrabold text-[#0B162A] block mt-0.5">
              ₹{(data.kpis?.total_sales_inr ?? 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600">
              {data.order_status?.total_orders ?? 0} Orders
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Expenses</span>
            <span className="text-lg font-extrabold text-[#0B162A] block mt-0.5">
              ₹{(data.kpis?.total_expenses_inr ?? 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              Logged Outflows
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Refunded Amount</span>
            <span className="text-lg font-extrabold text-[#D97706] block mt-0.5">
              ₹{data.kpis?.refunded_amount_inr?.toLocaleString() ?? '499'}
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              1 Return handled
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Stock in Hand</span>
            <span className="text-lg font-extrabold text-[#16A34A] block mt-0.5">
              {data.kpis?.stock_in_hand_pieces ?? 44} Pieces
            </span>
            <Link to="/inventory" className="text-[10px] font-semibold text-[#0B162A] underline block">
              Manage pieces →
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          DESKTOP FIRST ROW: 5 ESSENTIAL BOUTIQUE KPI CARDS (>= 640px)
      ────────────────────────────────────────────────────────── */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Balance Amount */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Balance Amount</span>
            <div className="w-9 h-9 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-extrabold tracking-tight text-[#0B162A]">
              ₹{data.kpis?.company_balance_inr?.toLocaleString() || '16,243'}
            </span>
          </div>
          <div className="mt-2.5 text-xs text-[#64748B] font-semibold">
            Bank: ₹{(data.kpis?.bank_balance_inr ?? 0).toLocaleString()} • Cash: ₹{(data.kpis?.cash_balance_inr ?? 0).toLocaleString()}
          </div>
        </div>

        {/* Card 2: Total Sales */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Total Sales</span>
            <div className="w-9 h-9 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-extrabold tracking-tight text-[#0B162A]">
              ₹{(data.kpis?.total_sales_inr ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-[#059669] font-semibold">
              {data.order_status?.total_orders ?? 0} Customer Orders
            </span>
            <span className="text-[#059669] text-[11px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              +28%
            </span>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Total Expenses</span>
            <div className="w-9 h-9 rounded-full bg-[#FFE4E6] flex items-center justify-center text-[#E11D48]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-extrabold tracking-tight text-[#0B162A]">
              ₹{(data.kpis?.total_expenses_inr ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Fabric, stitching & ops</span>
            <span className="text-rose-600 font-bold text-[11px] bg-rose-50 px-1.5 py-0.5 rounded">
              13 Bills
            </span>
          </div>
        </div>

        {/* Card 4: Refunded Amount */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Refunded Amount</span>
            <div className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-extrabold tracking-tight text-[#D97706]">
              ₹{data.kpis?.refunded_amount_inr?.toLocaleString() ?? '499'}
            </span>
          </div>
          <div className="mt-2.5 text-xs text-slate-500 font-medium">
            1 Return Handled (Stock Restored)
          </div>
        </div>

        {/* Card 5: Stock in Hand */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide">Stock in Hand</span>
            <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-extrabold tracking-tight text-[#16A34A]">
              {data.kpis?.stock_in_hand_pieces ?? 44} Pieces
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <Link to="/inventory" className="text-slate-600 hover:text-[#0B162A] font-semibold underline">
              Manage Stock (+/-) →
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          SECOND ROW: Trend Chart + Donut Chart
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Expenses Trend */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#0B162A]">Sales & Expenses Trend</h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                Sales
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]"></span>
                Expenses
              </span>
            </div>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sales_expenses_trend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E2E8F0' }} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickFormatter={(val) => `${val / 1000}K`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0B162A', borderRadius: '10px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="#A855F7" strokeWidth={2.5} fillOpacity={1} fill="url(#expGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Donut */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-card flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#0B162A]">Order Status</h3>

          <div className="flex items-center justify-center my-1 relative">
            <div className="w-[150px] h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-[#0B162A] leading-tight">
                {data.order_status?.total_orders ?? 0}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Orders
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-50">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                Sold
              </span>
              <span className="font-bold text-slate-800">{data.order_status?.breakdown?.sold ?? 0}</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-50">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                Processing
              </span>
              <span className="font-bold text-slate-800">{data.order_status?.breakdown?.processing ?? 0}</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-50">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#FCD34D]"></span>
                Pending
              </span>
              <span className="font-bold text-slate-800">{data.order_status?.breakdown?.pending ?? 0}</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-50">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#F87171]"></span>
                Cancelled
              </span>
              <span className="font-bold text-slate-800">{data.order_status?.breakdown?.cancelled ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          FOURTH ROW: Today's Birthdays
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6">
        {/* Today's Birthdays */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cake className="w-4 h-4 text-pink-500" />
              <h3 className="text-sm font-bold text-[#0B162A]">Today's Birthdays</h3>
            </div>
            <Link
              to="/customers"
              className="text-xs font-semibold text-[#0B162A] hover:text-[#C9B7A5] flex items-center gap-1 transition-colors"
            >
              View All →
            </Link>
          </div>

          {!data.featured_birthday ? (
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-center">
              <p className="text-xs font-semibold text-slate-600">No birthdays today</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Add customers to track upcoming dates</p>
            </div>
          ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={data.featured_birthday.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={data.featured_birthday.name}
                className="w-10 h-10 rounded-full object-cover border border-white shadow-sm flex-shrink-0"
              />
              <div>
                <h4 className="text-xs font-bold text-[#0B162A]">
                  {data.featured_birthday.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {data.featured_birthday.date_of_birth}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`https://api.whatsapp.com/send?phone=${(data.featured_birthday.whatsapp_number || data.featured_birthday.phone || '').replace(/\D/g, '')}&text=${encodeURIComponent(
                  'Dearest ' +
                    data.featured_birthday.name +
                    ', wishing you a wonderful birthday from all of us at PARVAII!'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 text-xs font-semibold text-slate-700 shadow-sm transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Send Wish</span>
              </a>

              <Link
                to="/customers"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-sm transition-all"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>View Profile</span>
              </Link>
            </div>
          </div>
          )}
        </div>
      </div>

      <EditDropModal drop={editingDrop} onClose={() => setEditingDrop(null)} />
    </div>
  );
};

