import express from 'express';

const router = express.Router();

router.get('/pnl', (req, res) => {
  res.json({
    summary: {
      total_sales_inr: 0,
      cost_of_goods_inr: 0,
      gross_profit_inr: 0,
      operating_expenses_inr: 0,
      net_profit_inr: 0,
    }
  });
});

router.get('/sales', (req, res) => {
  res.json({
    total_sales_inr: 0,
    orders_count: 0,
    avg_order_value_inr: 0,
  });
});

router.get('/cash-flow', (req, res) => {
  res.json({
    opening_balance_inr: 0,
    cash_inflows_inr: 0,
    cash_outflows_inr: 0,
    closing_balance_inr: 0,
  });
});

export default router;
