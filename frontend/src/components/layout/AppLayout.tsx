import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { NewOrderModal } from '../modals/NewOrderModal';
import { AddExpenseModal } from '../modals/AddExpenseModal';
import { AddPurchaseModal } from '../modals/AddPurchaseModal';
import { ReceivePaymentModal } from '../modals/ReceivePaymentModal';
import { SettleReimbursementModal } from '../modals/SettleReimbursementModal';
import { NewDropModal } from '../modals/NewDropModal';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0B162A] flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0 transition-all duration-300">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Smartphones only) */}
      <MobileBottomNav onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Global Quick Action Modals */}
      <NewOrderModal />
      <AddExpenseModal />
      <AddPurchaseModal />
      <ReceivePaymentModal />
      <SettleReimbursementModal />
      <NewDropModal />
    </div>
  );
};

