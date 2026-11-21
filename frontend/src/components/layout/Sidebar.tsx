import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Tag,
  Layers,
  ShoppingCart,
  FileText,
  ArrowLeftRight,
  Wallet,
  UserCheck,
  BarChart2,
  Settings,
  ShoppingBag,
  X,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Initially closed so the sidebar remains clean and focused on essentials
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);

  const primaryNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Balance & Cash', path: '/accounts', icon: Wallet },
    { name: 'Expenses', path: '/expenses', icon: FileText },
    { name: 'Stock Manage', path: '/inventory', icon: Layers },
    { name: 'Orders', path: '/orders', icon: Package, badge: '16' },
    { name: 'Customer DB', path: '/customers', icon: Users },
  ];

  const secondaryNavItems = [
    { name: 'Dress Catalog', path: '/products', icon: Tag },
    { name: 'Purchases (Fabric)', path: '/purchases', icon: ShoppingCart },
    { name: 'Reimbursements', path: '/reimbursements', icon: ArrowLeftRight },
    { name: 'Founders / Partners', path: '/members', icon: UserCheck },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => location.pathname === item.path);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#0B162A] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out overflow-hidden lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="pt-4 pb-3 px-5 flex flex-col items-center border-b border-[#1A2740] shrink-0">
          <div className="flex items-center justify-between w-full lg:justify-center relative">
            <div className="flex flex-col items-center mx-auto text-center">
              <img
                src="/parvaii-logo-beige.png"
                alt="PARVAII"
                className="h-14 w-auto object-contain mb-1"
              />
              <p className="text-[10px] tracking-widest text-[#C9B7A5] uppercase font-semibold">
                Brand ERP
              </p>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden absolute right-0 top-0 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation List - no visible scrollbar */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-2.5 space-y-0.5 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Core Essentials
          </div>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-[#0B162A] shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-[#162544]/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#0B162A]' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-semibold ${
                          isActive
                            ? 'bg-[#0B162A] text-white'
                            : 'bg-[#1E293B] text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* More Tools - Elegant Collapsible Accordion (Initially Closed) */}
          <div className="pt-2 border-t border-slate-800/80 mt-2.5">
            <button
              type="button"
              onClick={() => setIsMoreToolsOpen(!isMoreToolsOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isMoreToolsOpen || isSecondaryActive
                  ? 'bg-[#121E36] text-[#C9B7A5] border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#162544]/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9B7A5]" />
                <span className="tracking-wide">More Tools</span>
                {isSecondaryActive && !isMoreToolsOpen && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9B7A5]" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>{isMoreToolsOpen ? 'Hide' : '5 tools'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMoreToolsOpen ? 'rotate-180 text-[#C9B7A5]' : 'text-slate-400'
                  }`}
                />
              </div>
            </button>

            {/* Collapsible Tool Drawer */}
            {isMoreToolsOpen && (
              <div className="mt-1.5 p-1 bg-[#060D1A]/80 rounded-2xl border border-slate-800/80 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-white text-[#0B162A] shadow-sm font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-[#162544]/50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? 'text-[#0B162A]' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
};
