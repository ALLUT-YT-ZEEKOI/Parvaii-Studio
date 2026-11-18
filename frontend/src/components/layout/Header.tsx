import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Plus,
  ShoppingBag,
  CreditCard,
  ShoppingCart,
  IndianRupee,
  LogOut,
  User as UserIcon,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    login,
    logout,
    activeCollection,
    setActiveCollection,
    collections,
    dateRange,
    setDateRange,
    setIsNewOrderOpen,
    setIsAddExpenseOpen,
    setIsAddPurchaseOpen,
    setIsReceivePaymentOpen,
    setIsAddDropOpen,
  } = useAuth();

  const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isAddNewDropdownOpen, setIsAddNewDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Page titles mapping
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/collections':
        return { title: 'Drops & Collections', subtitle: 'Manage seasonal boutique drops, stocks & isolation' };
      case '/orders':
        return { title: 'Orders', subtitle: 'Manage customer orders, fulfillments & tracking' };
      case '/customers':
        return { title: 'Customers (CRM)', subtitle: 'Customer profiles, purchase history & birthdays' };
      case '/products':
        return { title: 'Products', subtitle: 'Collection catalog, dress variants & sizes' };
      case '/inventory':
        return { title: 'Inventory', subtitle: 'Stock reservation, warehouse levels & audit movements' };
      case '/purchases':
        return { title: 'Purchases', subtitle: 'Raw material procurement, fabric & stitching bills' };
      case '/expenses':
        return { title: 'Expenses', subtitle: 'Company-paid & personally funded business expenditures' };
      case '/reimbursements':
        return { title: 'Reimbursements', subtitle: 'Member personal spend payables & settlement ledger' };
      case '/accounts':
        return { title: 'Accounts & Cash', subtitle: 'Company bank balances, cash box & capital tracking' };
      case '/members':
        return { title: 'Members', subtitle: 'Brand partners, equity shares & team access' };
      case '/reports':
        return { title: 'Reports & Analytics', subtitle: 'P&L statements, sales breakdowns & cash flow' };
      case '/settings':
        return { title: 'Settings', subtitle: 'Company configuration, sizes, categories & audit log' };
      default:
        return { title: 'Dashboard', subtitle: 'PARVAII – Clothing Brand Management' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="sticky top-0 z-30 bg-[#F8F9FC]/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 pt-4 pb-3">
      {/* Top Level: Hamburger, Page Title, Search & Profile */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Headings */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-[#0B162A] hover:bg-white transition-colors lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B162A]">
              {title}
            </h1>
            <p className="text-xs sm:text-[13px] text-[#64748B] font-medium hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Global Search, Notification & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Global Search Bar */}
          <div className="relative hidden md:flex items-center w-64 lg:w-80">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, customers, products..."
              className="w-full pl-9 pr-16 py-2 bg-white text-xs text-[#0B162A] rounded-xl border border-[#E5E7EB] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]/50 focus:border-[#C9B7A5] transition-all shadow-sm"
            />
            <span className="absolute right-3 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
              Ctrl + K
            </span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0B162A] hover:border-slate-300 shadow-sm transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>

          {/* Admin Avatar & Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-white transition-all text-left"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B162A] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs sm:text-[13px] font-bold text-[#0B162A] leading-tight">
                  {user?.name || 'Allu'}
                </span>
                <span className="text-[11px] text-[#64748B] capitalize leading-none font-medium mt-0.5">
                  {user?.role || 'Admin'}
                </span>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#0B162A]">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                {/* Switch Partner Quick Selector */}
                <div className="p-2 border-b border-slate-100 bg-slate-50/60" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 px-1">
                    Three Founding Partners:
                  </span>
                  <div className="space-y-1">
                    {[
                      { id: 1, name: 'Allu', role: 'admin', email: 'allu@parvaii.com' },
                      { id: 2, name: 'Paru', role: 'partner', email: 'paru@parvaii.com' },
                      { id: 3, name: 'Kathu', role: 'partner', email: 'kathu@parvaii.com' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          login(`token-${p.name}`, {
                            id: p.id,
                            name: p.name,
                            email: p.email,
                            role: p.role as any,
                            status: 'active',
                          });
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          user?.name === p.name
                            ? 'bg-white font-bold text-[#0B162A] shadow-sm border border-slate-200'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#C9B7A5]"></span>
                          {p.name}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">{p.role}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invisible backdrop to close any open dropdown on click-outside */}
      {(isCollectionDropdownOpen || isDateDropdownOpen || isAddNewDropdownOpen || isProfileDropdownOpen) && (
        <div
          className="fixed inset-0 z-30 bg-transparent cursor-default"
          onClick={() => {
            setIsCollectionDropdownOpen(false);
            setIsDateDropdownOpen(false);
            setIsAddNewDropdownOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}

      {/* Filter Row: Dropdown, Date Range, + Add New */}
      <div className="flex items-center justify-between gap-2.5 mt-3 pt-1 overflow-x-auto no-scrollbar relative z-30">
        {/* Left Filters */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Collection / Drop Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setIsDateDropdownOpen(false);
                setIsAddNewDropdownOpen(false);
                setIsProfileDropdownOpen(false);
                setIsCollectionDropdownOpen(!isCollectionDropdownOpen);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#0B162A] text-xs font-semibold rounded-xl border border-[#E5E7EB] hover:border-slate-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9B7A5]"></span>
              <span className="font-bold">{activeCollection}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isCollectionDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Boutique Drop
                </div>

                {/* Option 1: All Drops */}
                <button
                  onClick={() => {
                    setActiveCollection('All Drops');
                    setIsCollectionDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    activeCollection === 'All Drops' ? 'font-bold text-[#0B162A] bg-slate-100/70' : 'text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-600" />
                    <span>All Drops</span>
                  </span>
                  <span className="text-[10px] bg-slate-200/60 px-2 py-0.5 rounded-full text-slate-600 font-semibold">
                    Combined
                  </span>
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                {/* Collection Items */}
                {collections.map((col) => {
                  const isSelected = activeCollection === col.name;
                  return (
                    <button
                      key={col.id || col._id || col.name}
                      onClick={() => {
                        setActiveCollection(col.name);
                        setIsCollectionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        isSelected ? 'font-bold text-[#0B162A] bg-amber-50/50' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-600 ring-2 ring-amber-200' : 'bg-slate-300'}`}></span>
                        <span>{col.name}</span>
                        {col.subtitle && (
                          <span className="text-[10.5px] text-slate-400 font-normal">
                            ({col.subtitle})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        {col.season || col.status}
                      </span>
                    </button>
                  );
                })}

                <div className="my-1.5 border-t border-slate-100" />

                {/* Add New Drop Action Button */}
                <button
                  onClick={() => {
                    setIsCollectionDropdownOpen(false);
                    setIsAddDropOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>+ Add Next Drop</span>
                </button>
              </div>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setIsCollectionDropdownOpen(false);
                setIsAddNewDropdownOpen(false);
                setIsProfileDropdownOpen(false);
                setIsDateDropdownOpen(!isDateDropdownOpen);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#0B162A] text-xs font-medium rounded-xl border border-[#E5E7EB] hover:border-slate-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isDateDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Filter Date Range
                </div>
                {[
                  { label: 'All Time (Drop Lifespan)', desc: 'Show full history for active drop' },
                  { label: 'Jul 1, 2026 – Jul 31, 2026', desc: 'July 2026 sales period' },
                  { label: 'Last 30 Days', desc: 'Past month activity' },
                  { label: 'Full Year 2026', desc: 'Entire 2026 fiscal cycle' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setDateRange(item.label);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                      dateRange === item.label ? 'font-bold text-[#0B162A] bg-slate-100/70' : 'text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: + Add New Primary Button */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setIsCollectionDropdownOpen(false);
              setIsDateDropdownOpen(false);
              setIsProfileDropdownOpen(false);
              setIsAddNewDropdownOpen(!isAddNewDropdownOpen);
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#0B162A] text-white text-xs font-semibold rounded-xl hover:bg-[#162544] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0B162A]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
          </button>

          {isAddNewDropdownOpen && (
            <div
              className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setIsAddNewDropdownOpen(false)}
            >
              <button
                onClick={() => setIsNewOrderOpen(true)}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                <span>New Order</span>
              </button>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-rose-600" />
                <span>Add Expense</span>
              </button>
              <button
                onClick={() => setIsAddPurchaseOpen(true)}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                <span>Add Purchase</span>
              </button>
              <button
                onClick={() => setIsReceivePaymentOpen(true)}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                <span>Receive Payment</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => setIsAddDropOpen(true)}
                className="w-full text-left px-3.5 py-2 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2.5 transition-colors font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>New Collection / Drop</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

