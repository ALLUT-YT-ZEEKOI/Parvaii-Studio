export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'partner' | 'staff';
  phone?: string;
  avatar_url?: string;
  status: string;
}

export interface Collection {
  id: string | number;
  _id?: string;
  name: string;
  code: string;
  subtitle?: string;
  season?: string;
  launch_date?: string;
  status: string;
  description?: string;
  products_count?: number;
  orders_count?: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  sku: string;
  opening_stock: number;
  available_stock: number;
  reserved_stock: number;
  sold_stock: number;
  damaged_stock: number;
  selling_price_override_paise?: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  slug: string;
  collection_id?: number;
  category: string;
  fabric?: string;
  color?: string;
  description?: string;
  cost_price_paise: number;
  selling_price_paise: number;
  discount_paise: number;
  status: string;
  image_url?: string;
  cost_price_inr?: number;
  selling_price_inr: number;
  discount_inr?: number;
  available_stock?: number;
  variants?: ProductVariant[];
  collection?: Collection;
}

export interface Customer {
  id: number;
  customer_code: string;
  full_name: string;
  phone: string;
  whatsapp_number?: string;
  email?: string;
  date_of_birth?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  shipping_address?: string;
  customer_source?: string;
  marketing_consent?: boolean;
  avatar_url?: string;
  total_orders: number;
  total_spent_inr: number;
  outstanding_inr: number;
  first_purchase_date?: string;
  last_purchase_date?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_variant_id: number;
  product_name: string;
  size: string;
  quantity: number;
  unit_price_inr: number;
  total_price_inr: number;
  product?: Product;
}

export interface CustomerPayment {
  id: number;
  payment_number: string;
  order_id: number;
  customer_id: number;
  account_id: number;
  amount_inr: number;
  payment_mode: string;
  reference_number?: string;
  payment_date: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  collection_id?: number;
  order_date: string;
  subtotal_inr: number;
  discount_inr: number;
  delivery_charge_inr: number;
  total_inr: number;
  received_inr: number;
  balance_inr: number;
  order_status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'sold' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'partially_paid' | 'paid' | 'refunded';
  shipping_phone?: string;
  shipping_address?: string;
  courier_partner?: string;
  tracking_number?: string;
  customer?: Customer;
  items?: OrderItem[];
  payments?: CustomerPayment[];
  collection?: Collection;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  is_custom?: boolean;
}

export interface Expense {
  id: number;
  expense_number: string;
  expense_date: string;
  category_id: number;
  category_name: string;
  description: string;
  amount_inr: number;
  amount_paise: number;
  funding_source: 'company_account' | 'personal_member' | 'unpaid_supplier' | 'split';
  company_account_id?: number;
  paid_by_user_id?: number;
  payment_mode: string;
  collection_id?: number;
  supplier_id?: number;
  reference_number?: string;
  status: string;
  notes?: string;
  category?: ExpenseCategory;
  company_account?: Account;
  paid_by_member?: User;
  reimbursement?: Reimbursement;
}

export interface ReimbursementSettlement {
  id: number;
  settlement_number: string;
  reimbursement_id: number;
  user_id: number;
  account_id: number;
  amount_inr: number;
  payment_mode: string;
  reference_number?: string;
  settlement_date: string;
  notes?: string;
  account?: Account;
  member?: User;
}

export interface Reimbursement {
  id: number;
  reimbursement_number: string;
  expense_id: number;
  user_id: number;
  claim_inr: number;
  settled_inr: number;
  outstanding_inr: number;
  status: 'pending' | 'partial' | 'paid' | 'rejected';
  claim_date: string;
  expense?: Expense;
  member?: User;
  settlements?: ReimbursementSettlement[];
}

export interface Account {
  id: number;
  name: string;
  type: 'bank' | 'cash';
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  branch?: string;
  balance_inr: number;
  opening_balance_inr: number;
  is_active: boolean;
}

export interface AccountTransaction {
  id: number;
  account_id: number;
  type: string;
  amount_inr: number;
  balance_after_inr: number;
  payment_mode: string;
  reference_number?: string;
  reference_type?: string;
  transaction_date: string;
  description?: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  gst_number?: string;
  outstanding_payable_inr: number;
  purchases_count?: number;
}

export interface PurchaseItem {
  id: number;
  purchase_id: number;
  material_type: string;
  item_name: string;
  unit: string;
  quantity: number;
  unit_price_inr?: number;
  total_amount_inr?: number;
}

export interface Purchase {
  id: number;
  purchase_number: string;
  supplier_id: number;
  collection_id?: number;
  purchase_date: string;
  total_inr: number;
  paid_inr: number;
  balance_inr: number;
  payment_status: string;
  payment_source: string;
  bill_number?: string;
  status: string;
  supplier?: Supplier;
  items?: PurchaseItem[];
}

export interface DashboardData {
  active_drop?: string;
  kpis: {
    total_sales_inr: number;
    total_sales_growth: string;
    total_expenses_inr: number;
    total_expenses_growth: string;
    net_profit_inr: number;
    net_profit_growth: string;
    company_balance_inr: number;
    bank_balance_inr: number;
    cash_balance_inr: number;
    refunded_amount_inr?: number;
    stock_in_hand_pieces?: number;
    pending_reimbursements_inr: number;
    pending_reimbursement_members: number;
  };
  sales_expenses_trend: {
    month: string;
    sales: number;
    expenses: number;
  }[];
  order_status: {
    total_orders: number;
    breakdown: {
      sold: number;
      processing: number;
      pending: number;
      cancelled: number;
    };
  };
  recent_orders: {
    id: number | string;
    order_number: string;
    customer_name: string;
    customer_id?: number | string;
    product_name: string;
    product_image?: string;
    quantity: number;
    amount_inr: number;
    status: string;
    order_date?: string;
  }[];
  low_stock_alerts: {
    id: number | string;
    name: string;
    category: string;
    image_url?: string;
    sizes_range: string;
    available_stock: number;
  }[];
  customer_overview: {
    total_customers: number;
    repeat_customers: number;
    birthdays_this_week: number;
    avg_order_value_inr: number;
  };
  featured_birthday?: {
    id: number | string;
    name: string;
    phone: string;
    whatsapp_number: string;
    date_of_birth: string;
    avatar_url?: string;
  };
}

