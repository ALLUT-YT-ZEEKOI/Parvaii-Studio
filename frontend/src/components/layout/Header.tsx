import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-30 bg-transparent cursor-default"
          onClick={() => {
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </header>
  );
};

