import axios from 'axios';
import { DashboardData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000/api/v1' : '/api/v1');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 25000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('parvaii_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createCleanDashboardData = (dropName: string = 'All Drops'): DashboardData => ({
  active_drop: dropName,
  kpis: {
    total_sales_inr: 0,
    total_sales_growth: '0%',
    total_expenses_inr: 0,
    total_expenses_growth: '0%',
    net_profit_inr: 0,
    net_profit_growth: '0%',
    company_balance_inr: 0,
    bank_balance_inr: 0,
    cash_balance_inr: 0,
    refunded_amount_inr: 0,
    stock_in_hand_pieces: 0,
    pending_reimbursements_inr: 0,
    pending_reimbursement_members: 0,
  },
  sales_expenses_trend: [
    { month: 'Jan', sales: 0, expenses: 0 },
    { month: 'Feb', sales: 0, expenses: 0 },
    { month: 'Mar', sales: 0, expenses: 0 },
    { month: 'Apr', sales: 0, expenses: 0 },
    { month: 'May', sales: 0, expenses: 0 },
    { month: 'Jun', sales: 0, expenses: 0 },
    { month: 'Jul', sales: 0, expenses: 0 },
  ],
  order_status: {
    total_orders: 0,
    breakdown: {
      sold: 0,
      processing: 0,
      pending: 0,
      cancelled: 0,
    },
  },
  recent_orders: [],
  low_stock_alerts: [],
  customer_overview: {
    total_customers: 0,
    repeat_customers: 0,
    birthdays_this_week: 0,
    avg_order_value_inr: 0,
  },
});

export const initialDashboardData: DashboardData = createCleanDashboardData();

export const getDashboardDataForDrop = (dropName: string): DashboardData => {
  return createCleanDashboardData(dropName || 'All Drops');
};
