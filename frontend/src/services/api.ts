import axios from 'axios';
import { DashboardData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000/api/v1' : '/api/v1');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('parvaii_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Drop 01 Dedicated Authentic Data
export const drop01DashboardData: DashboardData = {
  active_drop: 'Drop 01',
  kpis: {
    total_sales_inr: 126000,
    total_sales_growth: '+34%',
    total_expenses_inr: 77500,
    total_expenses_growth: '+18%',
    net_profit_inr: 48500,
    net_profit_growth: '+52%',
    company_balance_inr: 16243,
    bank_balance_inr: 12500,
    cash_balance_inr: 3743,
    refunded_amount_inr: 0,
    stock_in_hand_pieces: 55,
    pending_reimbursements_inr: 0,
    pending_reimbursement_members: 0,
  },
  sales_expenses_trend: [
    { month: 'Jan', sales: 10000, expenses: 7000 },
    { month: 'Feb', sales: 17000, expenses: 11000 },
    { month: 'Mar', sales: 15000, expenses: 9500 },
    { month: 'Apr', sales: 24000, expenses: 14000 },
    { month: 'May', sales: 31000, expenses: 19000 },
    { month: 'Jun', sales: 29000, expenses: 17000 },
    { month: 'Jul', sales: 0, expenses: 0 },
  ],
  order_status: {
    total_orders: 6,
    breakdown: {
      sold: 6,
      processing: 0,
      pending: 0,
      cancelled: 0,
    },
  },
  recent_orders: [
    { id: 'h6', order_number: 'HIST-ORD-06', customer_name: 'Ananya S.', product_name: 'Ethereal Linen Shirt (M)', product_image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 29000, status: 'sold', order_date: '2026-06-15' },
    { id: 'h5', order_number: 'HIST-ORD-05', customer_name: 'Priya K.', product_name: 'Pastel Summer Co-ord (S)', product_image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 31000, status: 'sold', order_date: '2026-05-15' },
    { id: 'h4', order_number: 'HIST-ORD-04', customer_name: 'Nivedita R.', product_name: 'Ivory Tiered Maxi (L)', product_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 24000, status: 'sold', order_date: '2026-04-15' },
    { id: 'h3', order_number: 'HIST-ORD-03', customer_name: 'Meera V.', product_name: 'Ethereal Linen Shirt (L)', product_image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 15000, status: 'sold', order_date: '2026-03-15' },
    { id: 'h2', order_number: 'HIST-ORD-02', customer_name: 'Divya B.', product_name: 'Pastel Summer Co-ord (M)', product_image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 17000, status: 'sold', order_date: '2026-02-15' },
  ],
  low_stock_alerts: [
    { id: 'p1', name: 'Ethereal Linen Shirt', category: 'Tops', image_url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 15 },
    { id: 'p2', name: 'Pastel Summer Co-ord', category: 'Co-ords', image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 18 },
    { id: 'p3', name: 'Ivory Tiered Maxi', category: 'Dresses', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 22 },
  ],
  customer_overview: {
    total_customers: 24,
    repeat_customers: 12,
    birthdays_this_week: 3,
    avg_order_value_inr: 21000,
  },
  featured_birthday: {
    id: 1,
    name: 'Ananya S.',
    phone: '+91 98765 43210',
    whatsapp_number: '+91 98765 43210',
    date_of_birth: '18 December',
  },
};

// Drop 02 Dedicated Authentic Data
export const drop02DashboardData: DashboardData = {
  active_drop: 'Drop 02',
  kpis: {
    total_sales_inr: 5791,
    total_sales_growth: '+28%',
    total_expenses_inr: 27984,
    total_expenses_growth: '+12%',
    net_profit_inr: -22193,
    net_profit_growth: '-15%',
    company_balance_inr: 16243,
    bank_balance_inr: 12500,
    cash_balance_inr: 3743,
    refunded_amount_inr: 499,
    stock_in_hand_pieces: 44,
    pending_reimbursements_inr: 2250,
    pending_reimbursement_members: 3,
  },
  sales_expenses_trend: [
    { month: 'Jan', sales: 0, expenses: 0 },
    { month: 'Feb', sales: 0, expenses: 0 },
    { month: 'Mar', sales: 0, expenses: 0 },
    { month: 'Apr', sales: 0, expenses: 0 },
    { month: 'May', sales: 0, expenses: 0 },
    { month: 'Jun', sales: 0, expenses: 0 },
    { month: 'Jul', sales: 5791, expenses: 27984 },
  ],
  order_status: {
    total_orders: 10,
    breakdown: {
      sold: 2,
      processing: 5,
      pending: 2,
      cancelled: 1,
    },
  },
  recent_orders: [
    { id: 10, order_number: 'ORD-010', customer_name: 'Ananya S.', product_name: 'Midnight Bloom Top (M)', product_image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 499, status: 'sold', order_date: '2026-07-28' },
    { id: 9, order_number: 'ORD-009', customer_name: 'Priya K.', product_name: 'Floral Dress (L)', product_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 299, status: 'processing', order_date: '2026-07-27' },
    { id: 8, order_number: 'ORD-008', customer_name: 'Nivedita R.', product_name: 'Midnight Bloom Top (S)', product_image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 499, status: 'pending', order_date: '2026-07-26' },
    { id: 7, order_number: 'ORD-007', customer_name: 'Kavya M.', product_name: 'Basic Kurti (XL)', product_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 599, status: 'sold', order_date: '2026-07-25' },
    { id: 6, order_number: 'ORD-006', customer_name: 'Deepa T.', product_name: 'Floral Dress (M)', product_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=120&q=80', quantity: 2, amount_inr: 899, status: 'processing', order_date: '2026-07-24' },
  ],
  low_stock_alerts: [
    { id: 1, name: 'Midnight Bloom Top', category: 'Tops', image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 8 },
    { id: 2, name: 'Floral Dress', category: 'Dresses', image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 12 },
    { id: 3, name: 'Basic Kurti', category: 'Kurtis', image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 24 },
  ],
  customer_overview: {
    total_customers: 24,
    repeat_customers: 8,
    birthdays_this_week: 3,
    avg_order_value_inr: 579,
  },
  featured_birthday: {
    id: 1,
    name: 'Ananya S.',
    phone: '+91 98765 43210',
    whatsapp_number: '+91 98765 43210',
    date_of_birth: '18 December',
  },
};

// All Drops Combined Authentic Data
export const allDropsDashboardData: DashboardData = {
  active_drop: 'All Drops',
  kpis: {
    total_sales_inr: 131791,
    total_sales_growth: '+28%',
    total_expenses_inr: 105484,
    total_expenses_growth: '+12%',
    net_profit_inr: 26307,
    net_profit_growth: '+42%',
    company_balance_inr: 16243,
    bank_balance_inr: 12500,
    cash_balance_inr: 3743,
    refunded_amount_inr: 499,
    stock_in_hand_pieces: 99,
    pending_reimbursements_inr: 2250,
    pending_reimbursement_members: 3,
  },
  sales_expenses_trend: [
    { month: 'Jan', sales: 10000, expenses: 7000 },
    { month: 'Feb', sales: 17000, expenses: 11000 },
    { month: 'Mar', sales: 15000, expenses: 9500 },
    { month: 'Apr', sales: 24000, expenses: 14000 },
    { month: 'May', sales: 31000, expenses: 19000 },
    { month: 'Jun', sales: 29000, expenses: 17000 },
    { month: 'Jul', sales: 39800, expenses: 27984 },
  ],
  order_status: {
    total_orders: 16,
    breakdown: {
      sold: 8,
      processing: 5,
      pending: 2,
      cancelled: 1,
    },
  },
  recent_orders: [
    { id: 10, order_number: 'ORD-010', customer_name: 'Ananya S.', product_name: 'Midnight Bloom Top (M)', product_image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 499, status: 'sold', order_date: '2026-07-28' },
    { id: 9, order_number: 'ORD-009', customer_name: 'Priya K.', product_name: 'Floral Dress (L)', product_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 299, status: 'processing', order_date: '2026-07-27' },
    { id: 8, order_number: 'ORD-008', customer_name: 'Nivedita R.', product_name: 'Midnight Bloom Top (S)', product_image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 499, status: 'pending', order_date: '2026-07-26' },
    { id: 'h6', order_number: 'HIST-ORD-06', customer_name: 'Ananya S.', product_name: 'Ethereal Linen Shirt (M)', product_image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 29000, status: 'sold', order_date: '2026-06-15' },
    { id: 'h5', order_number: 'HIST-ORD-05', customer_name: 'Priya K.', product_name: 'Pastel Summer Co-ord (S)', product_image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=120&q=80', quantity: 1, amount_inr: 31000, status: 'sold', order_date: '2026-05-15' },
  ],
  low_stock_alerts: [
    { id: 1, name: 'Midnight Bloom Top', category: 'Tops', image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 8 },
    { id: 2, name: 'Floral Dress', category: 'Dresses', image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 12 },
    { id: 'p1', name: 'Ethereal Linen Shirt', category: 'Tops', image_url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 15 },
    { id: 'p2', name: 'Pastel Summer Co-ord', category: 'Co-ords', image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=120&q=80', sizes_range: 'XS - XL', available_stock: 18 },
  ],
  customer_overview: {
    total_customers: 24,
    repeat_customers: 18,
    birthdays_this_week: 3,
    avg_order_value_inr: 8236,
  },
  featured_birthday: {
    id: 1,
    name: 'Ananya S.',
    phone: '+91 98765 43210',
    whatsapp_number: '+91 98765 43210',
    date_of_birth: '18 December',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
};

export const initialDashboardData: DashboardData = drop01DashboardData;

export const getDashboardDataForDrop = (dropName: string): DashboardData => {
  const norm = (dropName || '').toLowerCase();
  if (norm.includes('01') || norm.includes('drop 1') || norm.includes('ethereal')) {
    return drop01DashboardData;
  }
  if (norm.includes('02') || norm.includes('drop 2') || norm.includes('midnight')) {
    return drop02DashboardData;
  }
  if (norm.includes('all') || norm === '') {
    return allDropsDashboardData;
  }
  // Generic new drop (e.g. Drop 03)
  return {
    active_drop: dropName,
    kpis: {
      total_sales_inr: 0,
      total_sales_growth: '0%',
      total_expenses_inr: 0,
      total_expenses_growth: '0%',
      net_profit_inr: 0,
      net_profit_growth: '0%',
      company_balance_inr: 16243,
      bank_balance_inr: 12500,
      cash_balance_inr: 3743,
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
    order_status: { total_orders: 0, breakdown: { sold: 0, processing: 0, pending: 0, cancelled: 0 } },
    recent_orders: [],
    low_stock_alerts: [],
    customer_overview: { total_customers: 24, repeat_customers: 8, birthdays_this_week: 3, avg_order_value_inr: 0 },
  };
};
