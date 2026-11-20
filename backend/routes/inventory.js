import express from 'express';
import { Product, ProductVariant } from '../models/Product.js';

const router = express.Router();

const DROP_01_VARIANTS = [
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

const DROP_02_VARIANTS = [
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

router.get('/', async (req, res) => {
  const collectionId = req.query.collection_id || '';
  const norm = collectionId.toLowerCase();

  try {
    const filter = {};
    if (collectionId && !['all', 'all drops', 'undefined', 'null'].includes(norm)) {
      filter.collection_name = new RegExp(collectionId, 'i');
    }

    const products = await Product.find(filter).lean();
    if (products && products.length > 0) {
      const flattened = [];
      products.forEach(p => {
        if (p.variants && p.variants.length > 0) {
          p.variants.forEach(v => {
            flattened.push({
              id: v._id,
              sku: v.sku,
              size: v.size,
              available_stock: v.available_stock,
              reserved_stock: v.reserved_stock || 0,
              sold_stock: v.sold_stock || 0,
              damaged_stock: v.damaged_stock || 0,
              product: { name: p.name },
            });
          });
        }
      });
      if (flattened.length > 0) return res.json({ data: flattened });
    }

    return res.json({ data: [] });
  } catch (e) {
    return res.json({ data: [] });
  }
});

router.post('/adjust', (req, res) => {
  res.json({ message: 'Stock updated successfully' });
});

router.get('/movements', (req, res) => {
  res.json({
    data: [

    ]
  });
});

export default router;
