import express from 'express';

const router = express.Router();

router.get('/pnl', (req, res) => {
  res.json({
    summary: {
      total_sales_inr: 131791,
      cost_of_goods_inr: 45000,
      gross_profit_inr: 86791,
      operating_expenses_inr: 60484,
      net_profit_inr: 26307,
    }
  });
});

router.get('/sales', (req, res) => {
  res.json({
    total_sales_inr: 131791,
    orders_count: 16,
    avg_order_value_inr: 8236,
  });
});

router.get('/cash-flow', (req, res) => {
  res.json({
    opening_balance_inr: 20000,
    cash_inflows_inr: 131791,
    cash_outflows_inr: 105484,
    closing_balance_inr: 16243,
  });
});

export default router;
