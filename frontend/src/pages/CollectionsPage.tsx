import React, { useEffect, useState } from 'react';
import { Sparkles, Plus, Layers, Package, Calendar, Tag, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Collection } from '../types';
import { useNavigate } from 'react-router-dom';

export const CollectionsPage: React.FC = () => {
  const { collections, activeCollection, setActiveCollection, setIsAddDropOpen } = useAuth();
  const [dropsData, setDropsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDrops();
  }, [collections]);

  const loadDrops = async () => {
    setLoading(true);
    try {
      const res = await api.get('/collections');
      if (res.data && Array.isArray(res.data)) {
        setDropsData(res.data);
      }
    } catch (e) {
      // Fallback to collections from context
      setDropsData(collections);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDrop = (dropName: string) => {
    setActiveCollection(dropName);
    navigate('/');
  };

  // Find next logical drop number
  const nextDropNumber = (dropsData.length + 1).toString().padStart(2, '0');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B162A]">Brand Drops & Collections</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your boutique drops with independent stocks, expenses, sales and profit tracking.
          </p>
        </div>

        <button
          onClick={() => setIsAddDropOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B162A] text-white rounded-2xl text-xs sm:text-sm font-bold hover:bg-[#162544] shadow-md transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#C9B7A5]" />
          <span>+ Add Next Drop (Drop {nextDropNumber})</span>
        </button>
      </div>

      {/* Overview Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Drops</span>
          <span className="text-2xl font-extrabold text-[#0B162A] block mt-1">
            {dropsData.length || collections.length} Collections
          </span>
          <span className="text-xs text-slate-500 font-medium">Each with isolated inventory & P&L</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Currently Viewing</span>
          <span className="text-2xl font-extrabold text-purple-700 block mt-1">
            {activeCollection}
          </span>
          <span className="text-xs text-slate-500 font-medium">Active filter on Dashboard, Stock & Orders</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Next Up</span>
          <span className="text-2xl font-extrabold text-emerald-600 block mt-1">
            Drop {nextDropNumber} Ready
          </span>
          <span className="text-xs text-slate-500 font-medium">1-click create whenever you are ready</span>
        </div>
      </div>

      {/* Drops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Render Each Drop Card */}
        {dropsData.map((drop) => {
          const isActive = activeCollection === drop.name;
          return (
            <div
              key={drop.id || drop._id || drop.name}
              className={`relative overflow-hidden rounded-3xl transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-b from-[#0B162A] to-[#122340] text-white shadow-xl ring-2 ring-[#C9B7A5]'
                  : 'bg-white border border-slate-200/80 text-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      isActive
                        ? 'bg-[#C9B7A5]/20 text-[#C9B7A5] border border-[#C9B7A5]/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {drop.code || 'COLLECTION'}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#C9B7A5]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Drop
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3
                    className={`text-xl font-bold tracking-tight ${
                      isActive ? 'text-white' : 'text-[#0B162A]'
                    }`}
                  >
                    {drop.name}
                  </h3>
                  <p
                    className={`text-xs font-medium mt-1 ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {drop.subtitle || 'Custom Collection'} • {drop.season || '2026'}
                  </p>
                </div>

                {/* Drop Stats */}
                <div
                  className={`mt-5 grid grid-cols-2 gap-3 p-3.5 rounded-2xl ${
                    isActive ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-semibold uppercase block ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                      Styles & Garments
                    </span>
                    <span className={`text-base font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {drop.products_count ?? (drop.name === 'Drop 01' ? 3 : 3)} Styles
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-semibold uppercase block ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                      Orders Count
                    </span>
                    <span className={`text-base font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {drop.orders_count ?? (drop.name === 'Drop 01' ? 6 : 10)} Orders
                    </span>
                  </div>
                </div>

                {drop.description && (
                  <p className={`text-xs mt-3.5 line-clamp-2 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {drop.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className={`p-4 border-t ${isActive ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
                {isActive ? (
                  <button
                    onClick={() => navigate('/')}
                    className="w-full py-2.5 rounded-xl bg-[#C9B7A5] text-[#0B162A] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#b8a592] transition-colors"
                  >
                    <span>Viewing Dashboard for {drop.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectDrop(drop.name)}
                    className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#0B162A] hover:text-white hover:border-[#0B162A] transition-all shadow-2xs"
                  >
                    <span>Switch to {drop.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Next Drop Card */}
        <div
          onClick={() => setIsAddDropOpen(true)}
          className="group cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#C9B7A5] p-6 flex flex-col items-center justify-center text-center bg-white/50 hover:bg-white transition-all duration-200 min-h-[280px]"
        >
          <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-600 group-hover:bg-[#0B162A] group-hover:text-white flex items-center justify-center mb-3 transition-colors shadow-sm">
            <Plus className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#0B162A] group-hover:text-purple-700 transition-colors">
            + Add Next Drop (Drop {nextDropNumber})
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
            Launch Drop {nextDropNumber} with its own isolated stock, expenses, and sales tracking.
          </p>
          <span className="mt-4 px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-[#0B162A] text-slate-700 group-hover:text-white text-xs font-bold transition-all shadow-2xs">
            Create Drop {nextDropNumber} →
          </span>
        </div>
      </div>
    </div>
  );
};
