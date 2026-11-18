import express from 'express';
import { Purchase, Supplier } from '../models/Reimbursement.js';

const router = express.Router();

const DEFAULT_PURCHASES = [
  {
    id: 1,
    purchase_number: 'PUR-2026-0001',
    supplier_name: 'Heritage Weaves & Mills',
    collection_name: 'Drop 02',
    purchase_date: '2026-07-05',
    total_inr: 14750,
    paid_inr: 10250,
    balance_inr: 4500,
    payment_status: 'partially_paid',
    status: 'received',
    items: [
      { id: 1, material_type: 'Fabric', item_name: 'Fine Indigo Modal Cotton Bolt', unit: 'meters', quantity: 50, unit_price_inr: 295, total_amount_inr: 14750 }
    ]
  }
];

const DEFAULT_SUPPLIERS = [
  { id: 1, name: 'Heritage Weaves & Mills', contact_person: 'Ramesh Kumar', phone: '+91 94433 11223', city: 'Surat', outstanding_payable_inr: 4500, purchases_count: 1 },
  { id: 2, name: 'Bloom Tailoring Atelier', contact_person: 'Meenakshi Amma', phone: '+91 98410 44556', city: 'Chennai', outstanding_payable_inr: 0, purchases_count: 2 },
  { id: 3, name: 'EcoPack Boxes & Prints', contact_person: 'Vikram Shah', phone: '+91 97234 88990', city: 'Bengaluru', outstanding_payable_inr: 1200, purchases_count: 1 },
];

router.get('/', (req, res) => {
  res.json({ data: DEFAULT_PURCHASES });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Purchase recorded', data: req.body });
});

export default router;
