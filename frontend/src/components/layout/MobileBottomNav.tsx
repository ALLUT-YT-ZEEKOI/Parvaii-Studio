import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Plus,
  Layers,
  Menu,
  X,
  ShoppingBag,
  CreditCard,
  ShoppingCart,
  IndianRupee,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeSwitch } from '../common/ThemeSwitch';

interface MobileBottomNavProps {
  onOpenSidebar: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setIsNewOrderOpen,
    setIsAddExpenseOpen,
    setIsAddPurchaseOpen,
    setIsReceivePaymentOpen,
  } = useAuth();

  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleOpenAction = (action: () => void) => {
    setIsActionSheetOpen(false);
    action();
  };

  return (
    <>
      {/* Quick Action Bottom Sheet Drawer (Mobile Only) */}
      {isActionSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setIsActionSheetOpen(false)}
          />

          {/* Action Sheet Panel */}
          <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-[28px] p-5 shadow-2xl z-50 border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-base font-bold text-[#0B162A]">
                  Quick Brand Actions
                </h3>
                <p className="text-[11px] text-slate-500">
                  Transactional operations for PARVAII Atelier
                </p>
              </div>
              <button
                onClick={() => setIsActionSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button
                onClick={() => handleOpenAction(() => setIsNewOrderOpen(true))}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-[#0B162A] hover:text-white border border-slate-200/80 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">New Order</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Book customer order</span>
                </div>
              </button>

              <button
                onClick={() => handleOpenAction(() => setIsAddExpenseOpen(true))}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-[#0B162A] hover:text-white border border-slate-200/80 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Add Expense</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Company or personal</span>
                </div>
              </button>

              <button
                onClick={() => handleOpenAction(() => setIsAddPurchaseOpen(true))}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-[#0B162A] hover:text-white border border-slate-200/80 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Add Purchase</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Raw fabric & stitching</span>
                </div>
              </button>

              <button
                onClick={() => handleOpenAction(() => setIsReceivePaymentOpen(true))}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-[#0B162A] hover:text-white border border-slate-200/80 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Receive Pay</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Record customer pay</span>
                </div>
              </button>
            </div>

            {/* Quick Theme Switcher */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Workspace Theme</span>
              <ThemeSwitch size="sm" showLabels={true} />
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0B162A]/95 backdrop-blur-xl border-t border-slate-800 text-slate-400 lg:hidden px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-10px_25px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Dashboard Tab */}
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              isActive('/')
                ? 'text-[#C9B7A5] font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Home</span>
          </button>

          {/* 2. Orders Tab */}
          <button
            onClick={() => navigate('/orders')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl relative transition-all ${
              isActive('/orders')
                ? 'text-[#C9B7A5] font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            <div className="relative">
              <Package className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 bg-[#C9B7A5] text-[#0B162A] font-extrabold text-[9px] px-1 rounded-full">
                10
              </span>
            </div>
            <span className="text-[10px] tracking-wide">Orders</span>
          </button>

          {/* 3. Center Elevated Quick Action Button */}
          <button
            onClick={() => setIsActionSheetOpen(!isActionSheetOpen)}
            className="flex flex-col items-center -mt-5 group"
            aria-label="Quick Actions"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0B162A] via-[#1a2b4c] to-[#0B162A] border-2 border-[#C9B7A5] flex items-center justify-center text-[#C9B7A5] shadow-lg group-hover:scale-105 transition-all">
              <Plus className={`w-6 h-6 transition-transform duration-200 ${isActionSheetOpen ? 'rotate-45' : ''}`} />
            </div>
            <span className="text-[9.5px] font-semibold text-[#C9B7A5] mt-1">Add</span>
          </button>

          {/* 4. Inventory Tab */}
          <button
            onClick={() => navigate('/inventory')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              isActive('/inventory')
                ? 'text-[#C9B7A5] font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Stock</span>
          </button>

          {/* 5. Menu Tab (Toggles Sidebar Drawer) */}
          <button
            onClick={onOpenSidebar}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl hover:text-white text-slate-400 transition-all"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
};
