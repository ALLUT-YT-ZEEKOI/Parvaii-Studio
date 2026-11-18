import { Order, Expense, Product, Account } from '../types';

export interface DropAccountFlow {
  activeDrop: string;
  inflowInr: number;
  outflowInr: number;
  netInr: number;
  statusBadge: string;
  summaryNote: string;
}

// ─────────────────────────────────────────────────────────────
// 1. ORDERS BY DROP
// ─────────────────────────────────────────────────────────────

export const drop01Orders: Order[] = [
  {
    id: 106,
    order_number: 'HIST-ORD-06',
    customer_id: 1,
    order_date: '2026-06-15',
    subtotal_inr: 29000,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 29000,
    received_inr: 29000,
    balance_inr: 0,
    order_status: 'sold',
    payment_status: 'paid',
    customer: { id: 1, customer_code: 'CUST-0001', full_name: 'Ananya S.', phone: '+91 98765 43210', total_orders: 4, total_spent_inr: 34188, outstanding_inr: 0 },
    items: [{ id: 106, order_id: 106, product_id: 101, product_variant_id: 1013, product_name: 'Ethereal Linen Shirt', size: 'M', quantity: 1, unit_price_inr: 29000, total_price_inr: 29000 }]
  },
  {
    id: 105,
    order_number: 'HIST-ORD-05',
    customer_id: 2,
    order_date: '2026-05-15',
    subtotal_inr: 31000,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 31000,
    received_inr: 31000,
    balance_inr: 0,
    order_status: 'sold',
    payment_status: 'paid',
    customer: { id: 2, customer_code: 'CUST-0002', full_name: 'Priya K.', phone: '+91 98765 43211', total_orders: 3, total_spent_inr: 33594, outstanding_inr: 0 },
    items: [{ id: 105, order_id: 105, product_id: 102, product_variant_id: 1022, product_name: 'Pastel Summer Co-ord', size: 'S', quantity: 1, unit_price_inr: 31000, total_price_inr: 31000 }]
  },
  {
    id: 104,
    order_number: 'HIST-ORD-04',
    customer_id: 3,
    order_date: '2026-04-15',
    subtotal_inr: 24000,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 24000,
    received_inr: 24000,
    balance_inr: 0,
    order_status: 'sold',
    payment_status: 'paid',
    customer: { id: 3, customer_code: 'CUST-0003', full_name: 'Nivedita R.', phone: '+91 98765 43212', total_orders: 4, total_spent_inr: 27891, outstanding_inr: 0 },
    items: [{ id: 104, order_id: 104, product_id: 103, product_variant_id: 1034, product_name: 'Ivory Tiered Maxi', size: 'L', quantity: 1, unit_price_inr: 24000, total_price_inr: 24000 }]
  },
  {
    id: 103,
    order_number: 'HIST-ORD-03',
    customer_id: 4,
    order_date: '2026-03-15',
    subtotal_inr: 15000,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 15000,
    received_inr: 15000,
    balance_inr: 0,
    order_status: 'sold',
    payment_status: 'paid',
    customer: { id: 4, customer_code: 'CUST-0004', full_name: 'Meera V.', phone: '+91 98765 43213', total_orders: 2, total_spent_inr: 15000, outstanding_inr: 0 },
    items: [{ id: 103, order_id: 103, product_id: 101, product_variant_id: 1014, product_name: 'Ethereal Linen Shirt', size: 'L', quantity: 1, unit_price_inr: 15000, total_price_inr: 15000 }]
  },
  {
    id: 102,
    order_number: 'HIST-ORD-02',
    customer_id: 5,
    order_date: '2026-02-15',
    subtotal_inr: 17000,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 17000,
    received_inr: 17000,
    balance_inr: 0,
    order_status: 'sold',
    payment_status: 'paid',
    customer: { id: 5, customer_code: 'CUST-0005', full_name: 'Divya B.', phone: '+91 98765 43214', total_orders: 2, total_spent_inr: 17000, outstanding_inr: 0 },
    items: [{ id: 102, order_id: 102, product_id: 102, product_variant_id: 1023, product_name: 'Pastel Summer Co-ord', size: 'M', quantity: 1, unit_price_inr: 17000, total_price_inr: 17000 }]
  },
  {
    id: 101,
    order_number: 'HIST-ORD-01',
    customer_id: 6,
    order_date: '2026-01-20',
    subtotal_inr: 10000,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 10000,
    received_inr: 10000,
    balance_inr: 0,
    order_status: 'sold',
    payment_status: 'paid',
    customer: { id: 6, customer_code: 'CUST-0006', full_name: 'Shalini M.', phone: '+91 98765 43215', total_orders: 1, total_spent_inr: 10000, outstanding_inr: 0 },
    items: [{ id: 101, order_id: 101, product_id: 103, product_variant_id: 1033, product_name: 'Ivory Tiered Maxi', size: 'M', quantity: 1, unit_price_inr: 10000, total_price_inr: 10000 }]
  },
];

export const drop02Orders: Order[] = [
  {
    id: 10,
    order_number: 'ORD-010',
    customer_id: 1,
    order_date: '2026-07-28',
    subtotal_inr: 499,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 499,
    received_inr: 499,
    balance_inr: 0,
    order_status: 'sold',
    payment_status: 'paid',
    customer: { id: 1, customer_code: 'CUST-0001', full_name: 'Ananya S.', phone: '+91 98765 43210', total_orders: 4, total_spent_inr: 5188, outstanding_inr: 0 },
    items: [{ id: 1, order_id: 10, product_id: 1, product_variant_id: 3, product_name: 'Midnight Bloom Top', size: 'M', quantity: 1, unit_price_inr: 499, total_price_inr: 499 }]
  },
  {
    id: 9,
    order_number: 'ORD-009',
    customer_id: 2,
    order_date: '2026-07-27',
    subtotal_inr: 299,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 299,
    received_inr: 299,
    balance_inr: 0,
    order_status: 'processing',
    payment_status: 'paid',
    customer: { id: 2, customer_code: 'CUST-0002', full_name: 'Priya K.', phone: '+91 98765 43211', total_orders: 2, total_spent_inr: 2594, outstanding_inr: 0 },
    items: [{ id: 2, order_id: 9, product_id: 2, product_variant_id: 8, product_name: 'Floral Dress', size: 'L', quantity: 1, unit_price_inr: 299, total_price_inr: 299 }]
  },
  {
    id: 8,
    order_number: 'ORD-008',
    customer_id: 3,
    order_date: '2026-07-26',
    subtotal_inr: 499,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 499,
    received_inr: 200,
    balance_inr: 299,
    order_status: 'pending',
    payment_status: 'partially_paid',
    customer: { id: 3, customer_code: 'CUST-0003', full_name: 'Nivedita R.', phone: '+91 98765 43212', total_orders: 3, total_spent_inr: 3891, outstanding_inr: 0 },
    items: [{ id: 3, order_id: 8, product_id: 1, product_variant_id: 2, product_name: 'Midnight Bloom Top', size: 'S', quantity: 1, unit_price_inr: 499, total_price_inr: 499 }]
  },
  {
    id: 7,
    order_number: 'ORD-007',
    customer_id: 7,
    order_date: '2026-07-25',
    subtotal_inr: 599,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 599,
    received_inr: 599,
    balance_inr: 0,
    order_status: 'sold',
    payment_status: 'paid',
    customer: { id: 7, customer_code: 'CUST-0007', full_name: 'Kavya M.', phone: '+91 98765 43216', total_orders: 1, total_spent_inr: 599, outstanding_inr: 0 },
    items: [{ id: 4, order_id: 7, product_id: 3, product_variant_id: 14, product_name: 'Basic Kurti', size: 'XL', quantity: 1, unit_price_inr: 599, total_price_inr: 599 }]
  },
  {
    id: 6,
    order_number: 'ORD-006',
    customer_id: 8,
    order_date: '2026-07-24',
    subtotal_inr: 899,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 899,
    received_inr: 899,
    balance_inr: 0,
    order_status: 'processing',
    payment_status: 'paid',
    customer: { id: 8, customer_code: 'CUST-0008', full_name: 'Deepa T.', phone: '+91 98765 43217', total_orders: 2, total_spent_inr: 1298, outstanding_inr: 0 },
    items: [{ id: 5, order_id: 6, product_id: 2, product_variant_id: 7, product_name: 'Floral Dress', size: 'M', quantity: 2, unit_price_inr: 449.5, total_price_inr: 899 }]
  },
  {
    id: 5,
    order_number: 'ORD-005',
    customer_id: 9,
    order_date: '2026-07-22',
    subtotal_inr: 499,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 499,
    received_inr: 499,
    balance_inr: 0,
    order_status: 'processing',
    payment_status: 'paid',
    customer: { id: 9, customer_code: 'CUST-0009', full_name: 'Sneha P.', phone: '+91 98765 43218', total_orders: 1, total_spent_inr: 499, outstanding_inr: 0 },
    items: [{ id: 6, order_id: 5, product_id: 1, product_variant_id: 4, product_name: 'Midnight Bloom Top', size: 'L', quantity: 1, unit_price_inr: 499, total_price_inr: 499 }]
  },
  {
    id: 4,
    order_number: 'ORD-004',
    customer_id: 10,
    order_date: '2026-07-20',
    subtotal_inr: 1198,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 1198,
    received_inr: 1198,
    balance_inr: 0,
    order_status: 'processing',
    payment_status: 'paid',
    customer: { id: 10, customer_code: 'CUST-0010', full_name: 'Aarthi R.', phone: '+91 98765 43219', total_orders: 1, total_spent_inr: 1198, outstanding_inr: 0 },
    items: [{ id: 7, order_id: 4, product_id: 3, product_variant_id: 12, product_name: 'Basic Kurti', size: 'M', quantity: 2, unit_price_inr: 599, total_price_inr: 1198 }]
  },
  {
    id: 3,
    order_number: 'ORD-003',
    customer_id: 11,
    order_date: '2026-07-18',
    subtotal_inr: 598,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 598,
    received_inr: 598,
    balance_inr: 0,
    order_status: 'processing',
    payment_status: 'paid',
    customer: { id: 11, customer_code: 'CUST-0011', full_name: 'Radhika S.', phone: '+91 98765 43220', total_orders: 1, total_spent_inr: 598, outstanding_inr: 0 },
    items: [{ id: 8, order_id: 3, product_id: 2, product_variant_id: 6, product_name: 'Floral Dress', size: 'S', quantity: 2, unit_price_inr: 299, total_price_inr: 598 }]
  },
  {
    id: 2,
    order_number: 'ORD-002',
    customer_id: 12,
    order_date: '2026-07-15',
    subtotal_inr: 499,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 499,
    received_inr: 499,
    balance_inr: 0,
    order_status: 'pending',
    payment_status: 'paid',
    customer: { id: 12, customer_code: 'CUST-0012', full_name: 'Pooja K.', phone: '+91 98765 43221', total_orders: 1, total_spent_inr: 499, outstanding_inr: 0 },
    items: [{ id: 9, order_id: 2, product_id: 1, product_variant_id: 1, product_name: 'Midnight Bloom Top', size: 'XS', quantity: 1, unit_price_inr: 499, total_price_inr: 499 }]
  },
  {
    id: 1,
    order_number: 'ORD-001',
    customer_id: 13,
    order_date: '2026-07-12',
    subtotal_inr: 499,
    discount_inr: 0,
    delivery_charge_inr: 0,
    total_inr: 499,
    received_inr: 0,
    balance_inr: 0,
    order_status: 'cancelled',
    payment_status: 'refunded',
    customer: { id: 13, customer_code: 'CUST-0013', full_name: 'Swathi N.', phone: '+91 98765 43222', total_orders: 1, total_spent_inr: 0, outstanding_inr: 0 },
    items: [{ id: 10, order_id: 1, product_id: 3, product_variant_id: 13, product_name: 'Basic Kurti', size: 'L', quantity: 1, unit_price_inr: 499, total_price_inr: 499 }]
  },
];

export const getOrdersForDrop = (dropName: string): Order[] => {
  return [];
};

// ─────────────────────────────────────────────────────────────
// 2. EXPENSES BY DROP
// ─────────────────────────────────────────────────────────────

export const drop01Expenses: Expense[] = [
  {
    id: 101,
    expense_number: 'EXP-2026-D1-01',
    expense_date: '2026-01-10',
    category_id: 1,
    category_name: 'Fabric',
    description: 'Pure French Linen fabric procurement roll for Ethereal Dawn',
    amount_inr: 38000,
    amount_paise: 3800000,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
  },
  {
    id: 102,
    expense_number: 'EXP-2026-D1-02',
    expense_date: '2026-01-25',
    category_id: 2,
    category_name: 'Stitching',
    description: 'Master tailor cutting & artisanal sample stitching batch',
    amount_inr: 18500,
    amount_paise: 1850000,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
  },
  {
    id: 103,
    expense_number: 'EXP-2026-D1-03',
    expense_date: '2026-02-05',
    category_id: 7,
    category_name: 'Marketing',
    description: 'Drop 01 studio editorial shoot, model & photographer hire',
    amount_inr: 15000,
    amount_paise: 1500000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    paid_by_member: { id: 1, name: 'Allu', role: 'admin', email: 'allu@parvaii.com', status: 'active' }
  },
  {
    id: 104,
    expense_number: 'EXP-2026-D1-04',
    expense_date: '2026-02-12',
    category_id: 3,
    category_name: 'Packaging',
    description: 'Luxury debossed Parvaii gift boxes & organic cotton ribbon roll',
    amount_inr: 6000,
    amount_paise: 600000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    paid_by_member: { id: 2, name: 'Paru', role: 'partner', email: 'paru@parvaii.com', status: 'active' }
  },
];

export const drop02Expenses: Expense[] = [
  {
    id: 1,
    expense_number: 'EXP-2026-0001',
    expense_date: '2026-07-10',
    category_id: 1,
    category_name: 'Fabric',
    description: 'Fine Indigo Modal Fabric for Midnight Bloom sampled at local weaver',
    amount_inr: 1000,
    amount_paise: 100000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    paid_by_member: { id: 1, name: 'Allu', role: 'admin', email: 'allu@parvaii.com', status: 'active' }
  },
  {
    id: 2,
    expense_number: 'EXP-2026-0002',
    expense_date: '2026-07-14',
    category_id: 2,
    category_name: 'Stitching',
    description: 'Urgent boutique sample stitching batch',
    amount_inr: 750,
    amount_paise: 75000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    paid_by_member: { id: 2, name: 'Paru', role: 'partner', email: 'paru@parvaii.com', status: 'active' }
  },
  {
    id: 3,
    expense_number: 'EXP-2026-0003',
    expense_date: '2026-07-18',
    category_id: 3,
    category_name: 'Packaging',
    description: 'Custom butter paper and woven brand tags for Drop 02',
    amount_inr: 500,
    amount_paise: 50000,
    funding_source: 'personal_member',
    payment_mode: 'upi',
    status: 'approved',
    paid_by_member: { id: 3, name: 'Kathu', role: 'partner', email: 'kathu@parvaii.com', status: 'active' }
  },
  {
    id: 4,
    expense_number: 'EXP-2026-0004',
    expense_date: '2026-07-02',
    category_id: 7,
    category_name: 'Marketing',
    description: 'Meta & Instagram Sponsored Ad Campaign for Midnight Bloom Launch',
    amount_inr: 8500,
    amount_paise: 850000,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
  },
  {
    id: 5,
    expense_number: 'EXP-2026-0005',
    expense_date: '2026-07-08',
    category_id: 8,
    category_name: 'Website',
    description: 'Shopify & Custom Domain Renewal, SSL, Email hosting',
    amount_inr: 2484,
    amount_paise: 248400,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
  },
  {
    id: 6,
    expense_number: 'EXP-2026-0006',
    expense_date: '2026-07-05',
    category_id: 1,
    category_name: 'Fabric',
    description: 'Raw Linen & Cotton Blend Bolt for Floral Dress batch',
    amount_inr: 14750,
    amount_paise: 1475000,
    funding_source: 'company_account',
    payment_mode: 'bank_transfer',
    status: 'approved',
  },
];

export const getExpensesForDrop = (dropName: string): Expense[] => {
  return [];
};

// ─────────────────────────────────────────────────────────────
// 3. INVENTORY VARIANTS BY DROP
// ─────────────────────────────────────────────────────────────

export const drop01Variants = [
  { id: 1011, sku: 'PV-DR01-ELS-XS', size: 'XS', available_stock: 2, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Ethereal Linen Shirt' } },
  { id: 1012, sku: 'PV-DR01-ELS-S',  size: 'S',  available_stock: 3, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Ethereal Linen Shirt' } },
  { id: 1013, sku: 'PV-DR01-ELS-M',  size: 'M',  available_stock: 4, reserved_stock: 0, sold_stock: 3, damaged_stock: 0, product: { name: 'Ethereal Linen Shirt' } },
  { id: 1014, sku: 'PV-DR01-ELS-L',  size: 'L',  available_stock: 4, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Ethereal Linen Shirt' } },
  { id: 1015, sku: 'PV-DR01-ELS-XL', size: 'XL', available_stock: 2, reserved_stock: 0, sold_stock: 1, damaged_stock: 0, product: { name: 'Ethereal Linen Shirt' } },

  { id: 1021, sku: 'PV-DR01-PSC-XS', size: 'XS', available_stock: 3, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Pastel Summer Co-ord' } },
  { id: 1022, sku: 'PV-DR01-PSC-S',  size: 'S',  available_stock: 4, reserved_stock: 0, sold_stock: 3, damaged_stock: 0, product: { name: 'Pastel Summer Co-ord' } },
  { id: 1023, sku: 'PV-DR01-PSC-M',  size: 'M',  available_stock: 5, reserved_stock: 0, sold_stock: 3, damaged_stock: 0, product: { name: 'Pastel Summer Co-ord' } },
  { id: 1024, sku: 'PV-DR01-PSC-L',  size: 'L',  available_stock: 4, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Pastel Summer Co-ord' } },
  { id: 1025, sku: 'PV-DR01-PSC-XL', size: 'XL', available_stock: 2, reserved_stock: 0, sold_stock: 1, damaged_stock: 0, product: { name: 'Pastel Summer Co-ord' } },

  { id: 1031, sku: 'PV-DR01-ITM-XS', size: 'XS', available_stock: 3, reserved_stock: 0, sold_stock: 1, damaged_stock: 0, product: { name: 'Ivory Tiered Maxi' } },
  { id: 1032, sku: 'PV-DR01-ITM-S',  size: 'S',  available_stock: 5, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Ivory Tiered Maxi' } },
  { id: 1033, sku: 'PV-DR01-ITM-M',  size: 'M',  available_stock: 6, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Ivory Tiered Maxi' } },
  { id: 1034, sku: 'PV-DR01-ITM-L',  size: 'L',  available_stock: 5, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Ivory Tiered Maxi' } },
  { id: 1035, sku: 'PV-DR01-ITM-XL', size: 'XL', available_stock: 3, reserved_stock: 0, sold_stock: 1, damaged_stock: 0, product: { name: 'Ivory Tiered Maxi' } },
];

export const drop02Variants = [
  { id: 1, sku: 'PV-DR02-MBT-XS', size: 'XS', available_stock: 1, reserved_stock: 1, sold_stock: 1, damaged_stock: 0, product: { name: 'Midnight Bloom Top' } },
  { id: 2, sku: 'PV-DR02-MBT-S',  size: 'S',  available_stock: 2, reserved_stock: 1, sold_stock: 1, damaged_stock: 0, product: { name: 'Midnight Bloom Top' } },
  { id: 3, sku: 'PV-DR02-MBT-M',  size: 'M',  available_stock: 2, reserved_stock: 1, sold_stock: 1, damaged_stock: 0, product: { name: 'Midnight Bloom Top' } },
  { id: 4, sku: 'PV-DR02-MBT-L',  size: 'L',  available_stock: 2, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Midnight Bloom Top' } },
  { id: 5, sku: 'PV-DR02-MBT-XL', size: 'XL', available_stock: 1, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Midnight Bloom Top' } },

  { id: 6, sku: 'PV-DR02-FLD-S',  size: 'S',  available_stock: 3, reserved_stock: 1, sold_stock: 2, damaged_stock: 0, product: { name: 'Floral Dress' } },
  { id: 7, sku: 'PV-DR02-FLD-M',  size: 'M',  available_stock: 4, reserved_stock: 1, sold_stock: 2, damaged_stock: 0, product: { name: 'Floral Dress' } },
  { id: 8, sku: 'PV-DR02-FLD-L',  size: 'L',  available_stock: 3, reserved_stock: 1, sold_stock: 2, damaged_stock: 0, product: { name: 'Floral Dress' } },
  { id: 9, sku: 'PV-DR02-FLD-XL', size: 'XL', available_stock: 2, reserved_stock: 0, sold_stock: 1, damaged_stock: 0, product: { name: 'Floral Dress' } },

  { id: 10, sku: 'PV-DR02-BK-S',  size: 'S',  available_stock: 4, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Basic Kurti' } },
  { id: 11, sku: 'PV-DR02-BK-M',  size: 'M',  available_stock: 8, reserved_stock: 0, sold_stock: 4, damaged_stock: 0, product: { name: 'Basic Kurti' } },
  { id: 12, sku: 'PV-DR02-BK-L',  size: 'L',  available_stock: 7, reserved_stock: 0, sold_stock: 4, damaged_stock: 0, product: { name: 'Basic Kurti' } },
  { id: 13, sku: 'PV-DR02-BK-XL', size: 'XL', available_stock: 5, reserved_stock: 0, sold_stock: 2, damaged_stock: 0, product: { name: 'Basic Kurti' } },
];

export const getInventoryForDrop = (dropName: string): any[] => {
  return [];
};

// ─────────────────────────────────────────────────────────────
// 4. PRODUCTS BY DROP
// ─────────────────────────────────────────────────────────────

export const drop01Products: Product[] = [
  {
    id: 101,
    name: 'Ethereal Linen Shirt',
    sku: 'PV-DR01-ELS',
    slug: 'ethereal-linen-shirt',
    category: 'Tops',
    fabric: 'Pure French Linen',
    cost_price_paise: 110000,
    selling_price_paise: 249900,
    discount_paise: 0,
    selling_price_inr: 2499,
    cost_price_inr: 1100,
    available_stock: 15,
    status: 'archived',
    image_url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 1011, product_id: 101, size: 'XS', sku: 'PV-DR01-ELS-XS', opening_stock: 4, available_stock: 2, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 1012, product_id: 101, size: 'S',  sku: 'PV-DR01-ELS-S',  opening_stock: 5, available_stock: 3, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 1013, product_id: 101, size: 'M',  sku: 'PV-DR01-ELS-M',  opening_stock: 7, available_stock: 4, reserved_stock: 0, sold_stock: 3, damaged_stock: 0 },
      { id: 1014, product_id: 101, size: 'L',  sku: 'PV-DR01-ELS-L',  opening_stock: 6, available_stock: 4, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 1015, product_id: 101, size: 'XL', sku: 'PV-DR01-ELS-XL', opening_stock: 3, available_stock: 2, reserved_stock: 0, sold_stock: 1, damaged_stock: 0 },
    ]
  },
  {
    id: 102,
    name: 'Pastel Summer Co-ord',
    sku: 'PV-DR01-PSC',
    slug: 'pastel-summer-co-ord',
    category: 'Co-ords',
    fabric: 'Mulmul Cotton',
    cost_price_paise: 140000,
    selling_price_paise: 319900,
    discount_paise: 0,
    selling_price_inr: 3199,
    cost_price_inr: 1400,
    available_stock: 18,
    status: 'archived',
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 1021, product_id: 102, size: 'XS', sku: 'PV-DR01-PSC-XS', opening_stock: 5, available_stock: 3, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 1022, product_id: 102, size: 'S',  sku: 'PV-DR01-PSC-S',  opening_stock: 7, available_stock: 4, reserved_stock: 0, sold_stock: 3, damaged_stock: 0 },
      { id: 1023, product_id: 102, size: 'M',  sku: 'PV-DR01-PSC-M',  opening_stock: 8, available_stock: 5, reserved_stock: 0, sold_stock: 3, damaged_stock: 0 },
      { id: 1024, product_id: 102, size: 'L',  sku: 'PV-DR01-PSC-L',  opening_stock: 6, available_stock: 4, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 1025, product_id: 102, size: 'XL', sku: 'PV-DR01-PSC-XL', opening_stock: 3, available_stock: 2, reserved_stock: 0, sold_stock: 1, damaged_stock: 0 },
    ]
  },
  {
    id: 103,
    name: 'Ivory Tiered Maxi',
    sku: 'PV-DR01-ITM',
    slug: 'ivory-tiered-maxi',
    category: 'Dresses',
    fabric: 'Handwoven Silk Cotton',
    cost_price_paise: 180000,
    selling_price_paise: 399900,
    discount_paise: 0,
    selling_price_inr: 3999,
    cost_price_inr: 1800,
    available_stock: 22,
    status: 'archived',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 1031, product_id: 103, size: 'XS', sku: 'PV-DR01-ITM-XS', opening_stock: 4, available_stock: 3, reserved_stock: 0, sold_stock: 1, damaged_stock: 0 },
      { id: 1032, product_id: 103, size: 'S',  sku: 'PV-DR01-ITM-S',  opening_stock: 7, available_stock: 5, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 1033, product_id: 103, size: 'M',  sku: 'PV-DR01-ITM-M',  opening_stock: 8, available_stock: 6, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 1034, product_id: 103, size: 'L',  sku: 'PV-DR01-ITM-L',  opening_stock: 7, available_stock: 5, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 1035, product_id: 103, size: 'XL', sku: 'PV-DR01-ITM-XL', opening_stock: 4, available_stock: 3, reserved_stock: 0, sold_stock: 1, damaged_stock: 0 },
    ]
  },
];

export const drop02Products: Product[] = [
  {
    id: 1,
    name: 'Midnight Bloom Top',
    sku: 'PV-DR02-MBT',
    slug: 'midnight-bloom-top',
    category: 'Tops',
    fabric: 'Modal Cotton',
    cost_price_paise: 22000,
    selling_price_paise: 49900,
    discount_paise: 0,
    selling_price_inr: 499,
    cost_price_inr: 220,
    available_stock: 8,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 1, product_id: 1, size: 'XS', sku: 'PV-DR02-MBT-XS', opening_stock: 3, available_stock: 1, reserved_stock: 1, sold_stock: 1, damaged_stock: 0 },
      { id: 2, product_id: 1, size: 'S',  sku: 'PV-DR02-MBT-S',  opening_stock: 4, available_stock: 2, reserved_stock: 1, sold_stock: 1, damaged_stock: 0 },
      { id: 3, product_id: 1, size: 'M',  sku: 'PV-DR02-MBT-M',  opening_stock: 4, available_stock: 2, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 4, product_id: 1, size: 'L',  sku: 'PV-DR02-MBT-L',  opening_stock: 4, available_stock: 2, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 5, product_id: 1, size: 'XL', sku: 'PV-DR02-MBT-XL', opening_stock: 3, available_stock: 1, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
    ]
  },
  {
    id: 2,
    name: 'Floral Dress',
    sku: 'PV-DR02-FLD',
    slug: 'floral-dress',
    category: 'Dresses',
    fabric: 'Linen Blend',
    cost_price_paise: 15000,
    selling_price_paise: 29900,
    discount_paise: 0,
    selling_price_inr: 299,
    cost_price_inr: 150,
    available_stock: 12,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 6, product_id: 2, size: 'S',  sku: 'PV-DR02-FLD-S',  opening_stock: 6, available_stock: 3, reserved_stock: 1, sold_stock: 2, damaged_stock: 0 },
      { id: 7, product_id: 2, size: 'M',  sku: 'PV-DR02-FLD-M',  opening_stock: 7, available_stock: 4, reserved_stock: 1, sold_stock: 2, damaged_stock: 0 },
      { id: 8, product_id: 2, size: 'L',  sku: 'PV-DR02-FLD-L',  opening_stock: 6, available_stock: 3, reserved_stock: 1, sold_stock: 2, damaged_stock: 0 },
      { id: 9, product_id: 2, size: 'XL', sku: 'PV-DR02-FLD-XL', opening_stock: 3, available_stock: 2, reserved_stock: 0, sold_stock: 1, damaged_stock: 0 },
    ]
  },
  {
    id: 3,
    name: 'Basic Kurti',
    sku: 'PV-DR02-BK',
    slug: 'basic-kurti',
    category: 'Kurtis',
    fabric: 'Khadi Cotton',
    cost_price_paise: 18000,
    selling_price_paise: 59900,
    discount_paise: 0,
    selling_price_inr: 599,
    cost_price_inr: 180,
    available_stock: 24,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 10, product_id: 3, size: 'S',  sku: 'PV-DR02-BK-S',  opening_stock: 6,  available_stock: 4, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
      { id: 11, product_id: 3, size: 'M',  sku: 'PV-DR02-BK-M',  opening_stock: 12, available_stock: 8, reserved_stock: 0, sold_stock: 4, damaged_stock: 0 },
      { id: 12, product_id: 3, size: 'L',  sku: 'PV-DR02-BK-L',  opening_stock: 11, available_stock: 7, reserved_stock: 0, sold_stock: 4, damaged_stock: 0 },
      { id: 13, product_id: 3, size: 'XL', sku: 'PV-DR02-BK-XL', opening_stock: 7,  available_stock: 5, reserved_stock: 0, sold_stock: 2, damaged_stock: 0 },
    ]
  },
];

export const getProductsForDrop = (dropName: string): Product[] => {
  return [];
};

export const getAccountFlowForDrop = (dropName: string): DropAccountFlow => {
  return {
    activeDrop: dropName,
    inflowInr: 0,
    outflowInr: 0,
    netInr: 0,
    statusBadge: 'New / Clean Slate',
    summaryNote: 'No transactions recorded yet for this drop.'
  };
};
