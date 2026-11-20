import express from 'express';
import { Order } from '../models/Order.js';
import { Expense } from '../models/Expense.js';
import { Product } from '../models/Product.js';
import { Account } from '../models/Account.js';
import { Reimbursement } from '../models/Reimbursement.js';
import { Customer } from '../models/Customer.js';

const router = express.Router();

const emptyDashboard = (activeDrop = 'All Drops') => ({
  active_drop: activeDrop,
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
  sales_expenses_trend: [],
  order_status: {
    total_orders: 0,
    breakdown: { sold: 0, processing: 0, pending: 0, cancelled: 0 },
  },
  recent_orders: [],
  low_stock_alerts: [],
  customer_overview: {
    total_customers: 0,
    repeat_customers: 0,
    birthdays_this_week: 0,
    avg_order_value_inr: 0,
  },
  featured_birthday: null,
});

async function getAccountBalances() {
  const accounts = await Account.find({ is_active: true }).lean().catch(() => []);
  const bank = accounts.filter(a => a.type === 'bank').reduce((s, a) => s + (a.balance_paise || 0), 0) / 100;
  const cash = accounts.filter(a => a.type === 'cash').reduce((s, a) => s + (a.balance_paise || 0), 0) / 100;
  return { bank, cash, total: bank + cash };
}

router.get('/', async (req, res) => {
  const collectionId = req.query.collection_id || '';
  const norm = collectionId.toLowerCase();

  try {
    let activeDrop = 'All Drops';
    if (norm.includes('01') || norm.includes('drop 1') || norm.includes('ethereal')) {
      activeDrop = 'Drop 01';
    } else if (norm.includes('02') || norm.includes('drop 2') || norm.includes('midnight')) {
      activeDrop = 'Drop 02';
    } else if (collectionId && !['all', 'all drops', 'undefined', 'null'].includes(norm)) {
      activeDrop = collectionId;
    }

    const orderFilter = { order_status: { $ne: 'cancelled' } };
    const expenseFilter = { status: { $ne: 'cancelled' } };
    const productFilter = {};

    if (activeDrop !== 'All Drops') {
      orderFilter.collection_name = new RegExp(activeDrop, 'i');
      expenseFilter.collection_name = new RegExp(activeDrop, 'i');
      productFilter.collection_name = new RegExp(activeDrop, 'i');
    }

    const [dbOrders, dbExpenses, dbProducts, balances, reimbursements, customers] = await Promise.all([
      Order.find(orderFilter).lean().catch(() => []),
      Expense.find(expenseFilter).lean().catch(() => []),
      Product.find(productFilter).lean().catch(() => []),
      getAccountBalances(),
      Reimbursement.find({ status: { $in: ['pending', 'partial'] } }).lean().catch(() => []),
      Customer.find().lean().catch(() => []),
    ]);

    const totalSales = dbOrders.reduce((sum, o) => sum + (o.total_amount_paise || 0), 0) / 100;
    const totalExpenses = dbExpenses.reduce((sum, e) => sum + (e.amount_paise || 0), 0) / 100;
    const netProfit = totalSales - totalExpenses;
    const totalStock = dbProducts.reduce((sum, p) => {
      const variantsStock = p.variants ? p.variants.reduce((vs, v) => vs + (v.available_stock || 0), 0) : 0;
      return sum + variantsStock;
    }, 0);

    const statusCounts = { sold: 0, processing: 0, pending: 0, cancelled: 0 };
    dbOrders.forEach(o => {
      const st = o.order_status;
      if (['sold', 'delivered', 'completed'].includes(st)) statusCounts.sold++;
      else if (['processing', 'packed', 'confirmed'].includes(st)) statusCounts.processing++;
      else if (st === 'pending') statusCounts.pending++;
      else if (st === 'cancelled') statusCounts.cancelled++;
    });

    const pendingReimbInr = reimbursements.reduce((s, r) => s + (r.outstanding_amount_paise || 0), 0) / 100;
    const pendingMembers = new Set(reimbursements.map(r => String(r.user_id || r.member?.id || r._id))).size;

    const lowStock = [];
    dbProducts.forEach(p => {
      const available = p.variants ? p.variants.reduce((s, v) => s + (v.available_stock || 0), 0) : 0;
      if (available > 0 && available <= 10) {
        lowStock.push({
          id: p._id,
          name: p.name,
          category: p.category || 'Apparel',
          image_url: p.image_url || '',
          sizes_range: 'XS - XL',
          available_stock: available,
        });
      }
    });

    const repeatCustomers = customers.filter(c => (c.total_orders || 0) > 1).length;

    return res.json({
      active_drop: activeDrop,
      kpis: {
        total_sales_inr: totalSales,
        total_sales_growth: '0%',
        total_expenses_inr: totalExpenses,
        total_expenses_growth: '0%',
        net_profit_inr: netProfit,
        net_profit_growth: '0%',
        company_balance_inr: balances.total,
        bank_balance_inr: balances.bank,
        cash_balance_inr: balances.cash,
        refunded_amount_inr: 0,
        stock_in_hand_pieces: totalStock,
        pending_reimbursements_inr: pendingReimbInr,
        pending_reimbursement_members: pendingMembers,
      },
      sales_expenses_trend: [],
      order_status: {
        total_orders: dbOrders.length,
        breakdown: statusCounts,
      },
      recent_orders: dbOrders.slice(0, 5).map(o => ({
        id: o._id,
        order_number: o.order_number,
        customer_name: o.customer?.full_name || 'Customer',
        product_name: o.items?.[0] ? `${o.items[0].product_name} (${o.items[0].size})` : 'Apparel Item',
        quantity: o.items?.[0]?.quantity || 1,
        amount_inr: (o.total_amount_paise || 0) / 100,
        status: o.order_status,
        order_date: o.order_date,
      })),
      low_stock_alerts: lowStock.slice(0, 5),
      customer_overview: {
        total_customers: customers.length,
        repeat_customers: repeatCustomers,
        birthdays_this_week: 0,
        avg_order_value_inr: dbOrders.length > 0 ? Math.round(totalSales / dbOrders.length) : 0,
      },
      featured_birthday: null,
    });
  } catch (err) {
    console.error('[Dashboard Error]', err);
    return res.json(emptyDashboard('All Drops'));
  }
});

export default router;
