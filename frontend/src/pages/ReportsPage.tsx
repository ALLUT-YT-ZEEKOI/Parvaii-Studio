import React, { useEffect, useState } from 'react';
import { BarChart2, Download, Printer, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [pnl, setPnl] = useState<any>({
    sales_revenue_inr: 39800,
    cogs_inr: 16400,
    gross_profit_inr: 23400,
    gross_margin_percentage: 58.8,
    operating_expenses_inr: 27984,
    net_profit_inr: 11816,
    net_margin_percentage: 29.7,
  });

  const [cashFlow, setCashFlow] = useState<any>({
    inflows: { customer_payments_inr: 39800, total_inflow_inr: 39800 },
    outflows: { company_expenses_inr: 25734, reimbursements_paid_inr: 2250, total_outflow_inr: 27984 },
    net_cash_flow_inr: 11816,
  });

  useEffect(() => {
    api.get('/reports/pnl').then((res) => setPnl(res.data)).catch(() => {});
    api.get('/reports/cash-flow').then((res) => setCashFlow(res.data)).catch(() => {});
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Amount (INR)\n' +
      `Gross Sales Revenue,${pnl.sales_revenue_inr}\n` +
      `Cost of Goods Sold (COGS),${pnl.cogs_inr}\n` +
      `Gross Profit,${pnl.gross_profit_inr}\n` +
      `Total Operating Expenses,${pnl.operating_expenses_inr}\n` +
      `Net Profit,${pnl.net_profit_inr}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'PARVAII_Financial_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B162A]">Financial Reports & Statements</h2>
          <p className="text-xs text-slate-500">P&L, Cash Flow, and operational balance sheet analytics</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B162A] text-white rounded-xl text-xs font-semibold hover:bg-[#162544] shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* P&L Statement Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0B162A]">Statement of Profit and Loss</h3>
            <span className="text-xs text-slate-400">For the period Jul 1, 2026 – Jul 31, 2026 (Drop 02)</span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            Audit Approved
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Revenue */}
          <div className="py-3 flex justify-between items-center font-bold text-slate-800">
            <span className="text-sm text-[#0B162A]">1. Gross Sales Revenue</span>
            <span className="text-sm text-[#0B162A]">₹{pnl.sales_revenue_inr?.toLocaleString()}</span>
          </div>

          {/* COGS */}
          <div className="py-2.5 flex justify-between items-center text-slate-600 pl-4">
            <span>Less: Cost of Goods Sold (Fabric + Stitching + Direct Materials)</span>
            <span className="font-semibold text-rose-600">- ₹{pnl.cogs_inr?.toLocaleString()}</span>
          </div>

          {/* Gross Profit */}
          <div className="py-3 flex justify-between items-center font-bold bg-slate-50/80 px-3 rounded-lg">
            <span>Gross Profit (Margin: {pnl.gross_margin_percentage}%)</span>
            <span className="text-emerald-700 font-extrabold">₹{pnl.gross_profit_inr?.toLocaleString()}</span>
          </div>

          {/* Operating Expenses */}
          <div className="py-3 flex justify-between items-center font-bold text-slate-800">
            <span className="text-sm text-[#0B162A]">2. Total Operating Expenses</span>
            <span className="text-sm text-rose-600">- ₹{pnl.operating_expenses_inr?.toLocaleString()}</span>
          </div>

          <div className="py-2 flex justify-between items-center text-slate-500 pl-4">
            <span>• Marketing & Meta Sponsored Campaigns</span>
            <span>₹8,500</span>
          </div>
          <div className="py-2 flex justify-between items-center text-slate-500 pl-4">
            <span>• Production & Atelier Master Stitching</span>
            <span>₹11,000</span>
          </div>
          <div className="py-2 flex justify-between items-center text-slate-500 pl-4">
            <span>• Website, Shopify Domain & Software</span>
            <span>₹2,484</span>
          </div>
          <div className="py-2 flex justify-between items-center text-slate-500 pl-4">
            <span>• Packaging, Boxes & Brand Tags</span>
            <span>₹5,000</span>
          </div>

          {/* Net Profit */}
          <div className="py-4 flex justify-between items-center font-extrabold text-base bg-[#0B162A] text-white px-4 rounded-xl mt-4">
            <span>Net Profit for the Period</span>
            <span className="text-[#C9B7A5]">₹{pnl.net_profit_inr?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Cash Flow Statement */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-card p-6 space-y-4">
        <h3 className="text-base font-bold text-[#0B162A]">Cash Flow Statement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
            <span className="text-xs font-semibold text-emerald-800 block">Operating Inflows</span>
            <span className="text-xl font-bold text-emerald-900 mt-1 block">
              ₹{cashFlow.inflows?.total_inflow_inr?.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-700">Customer payments collected</span>
          </div>

          <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl">
            <span className="text-xs font-semibold text-rose-800 block">Operating Outflows</span>
            <span className="text-xl font-bold text-rose-900 mt-1 block">
              ₹{cashFlow.outflows?.total_outflow_inr?.toLocaleString()}
            </span>
            <span className="text-[11px] text-rose-700">Expenses & partner settlements</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-semibold text-slate-700 block">Net Liquidity Inflow</span>
            <span className="text-xl font-bold text-[#0B162A] mt-1 block">
              ₹{cashFlow.net_cash_flow_inr?.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">Reflected in Bank/Cash balances</span>
          </div>
        </div>
      </div>
    </div>
  );
};

