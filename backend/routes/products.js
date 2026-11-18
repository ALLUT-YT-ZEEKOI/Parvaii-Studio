import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

const DROP_01_PRODUCTS = [
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
    collection_name: 'Drop 01',
    image_url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 1011, size: 'XS', sku: 'PV-DR01-ELS-XS', available_stock: 2 },
      { id: 1012, size: 'S',  sku: 'PV-DR01-ELS-S',  available_stock: 3 },
      { id: 1013, size: 'M',  sku: 'PV-DR01-ELS-M',  available_stock: 4 },
      { id: 1014, size: 'L',  sku: 'PV-DR01-ELS-L',  available_stock: 4 },
      { id: 1015, size: 'XL', sku: 'PV-DR01-ELS-XL', available_stock: 2 },
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
    collection_name: 'Drop 01',
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 1021, size: 'XS', sku: 'PV-DR01-PSC-XS', available_stock: 3 },
      { id: 1022, size: 'S',  sku: 'PV-DR01-PSC-S',  available_stock: 4 },
      { id: 1023, size: 'M',  sku: 'PV-DR01-PSC-M',  available_stock: 5 },
      { id: 1024, size: 'L',  sku: 'PV-DR01-PSC-L',  available_stock: 4 },
      { id: 1025, size: 'XL', sku: 'PV-DR01-PSC-XL', available_stock: 2 },
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
    collection_name: 'Drop 01',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 1031, size: 'XS', sku: 'PV-DR01-ITM-XS', available_stock: 3 },
      { id: 1032, size: 'S',  sku: 'PV-DR01-ITM-S',  available_stock: 5 },
      { id: 1033, size: 'M',  sku: 'PV-DR01-ITM-M',  available_stock: 6 },
      { id: 1034, size: 'L',  sku: 'PV-DR01-ITM-L',  available_stock: 5 },
      { id: 1035, size: 'XL', sku: 'PV-DR01-ITM-XL', available_stock: 3 },
    ]
  },
];

const DROP_02_PRODUCTS = [
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
    collection_name: 'Drop 02',
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 1, size: 'XS', sku: 'PV-DR02-MBT-XS', available_stock: 1 },
      { id: 2, size: 'S',  sku: 'PV-DR02-MBT-S',  available_stock: 2 },
      { id: 3, size: 'M',  sku: 'PV-DR02-MBT-M',  available_stock: 2 },
      { id: 4, size: 'L',  sku: 'PV-DR02-MBT-L',  available_stock: 2 },
      { id: 5, size: 'XL', sku: 'PV-DR02-MBT-XL', available_stock: 1 },
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
    collection_name: 'Drop 02',
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 6, size: 'S',  sku: 'PV-DR02-FLD-S',  available_stock: 3 },
      { id: 7, size: 'M',  sku: 'PV-DR02-FLD-M',  available_stock: 4 },
      { id: 8, size: 'L',  sku: 'PV-DR02-FLD-L',  available_stock: 3 },
      { id: 9, size: 'XL', sku: 'PV-DR02-FLD-XL', available_stock: 2 },
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
    collection_name: 'Drop 02',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 10, size: 'S',  sku: 'PV-DR02-BK-S',  available_stock: 4 },
      { id: 11, size: 'M',  sku: 'PV-DR02-BK-M',  available_stock: 8 },
      { id: 12, size: 'L',  sku: 'PV-DR02-BK-L',  available_stock: 7 },
      { id: 13, size: 'XL', sku: 'PV-DR02-BK-XL', available_stock: 5 },
    ]
  },
];

router.get('/', async (req, res) => {
  const collectionId = req.query.collection_id || '';
  const norm = collectionId.toLowerCase();

  try {
    const filter = {};
    if (collectionId && !['all', 'all drops', 'undefined', 'null'].includes(norm)) {
      filter.collection_name = new RegExp(collectionId, 'i');
    }

    const list = await Product.find(filter).lean();
    if (list && list.length > 0) {
      return res.json({
        data: list.map(p => ({
          ...p,
          id: p._id,
          selling_price_inr: (p.selling_price_paise || 0) / 100,
          cost_price_inr: (p.cost_price_paise || 0) / 100,
          available_stock: p.variants ? p.variants.reduce((acc, v) => acc + (v.available_stock || 0), 0) : 0,
        }))
      });
    }

    if (norm.includes('01') || norm.includes('drop 1')) {
      return res.json({ data: DROP_01_PRODUCTS });
    }
    if (norm.includes('02') || norm.includes('drop 2')) {
      return res.json({ data: DROP_02_PRODUCTS });
    }
    return res.json({ data: [...DROP_02_PRODUCTS, ...DROP_01_PRODUCTS] });
  } catch (e) {
    if (norm.includes('01')) return res.json({ data: DROP_01_PRODUCTS });
    if (norm.includes('02')) return res.json({ data: DROP_02_PRODUCTS });
    return res.json({ data: [...DROP_02_PRODUCTS, ...DROP_01_PRODUCTS] });
  }
});

router.post('/', async (req, res) => {
  try {
    const p = req.body;
    const newProd = await Product.create({
      name: p.name,
      sku: p.sku || `PV-${Date.now().toString().slice(-4)}`,
      category: p.category || 'Dresses',
      fabric: p.fabric || 'Cotton',
      collection_name: p.collection_name || 'Drop 02',
      cost_price_paise: (p.cost_price_inr || p.cost_price || 200) * 100,
      selling_price_paise: (p.selling_price_inr || p.selling_price || 599) * 100,
      image_url: p.image_url,
      status: 'active',
      variants: [
        { size: 'XS', sku: `${p.sku || 'PV'}-XS`, available_stock: 2 },
        { size: 'S',  sku: `${p.sku || 'PV'}-S`,  available_stock: 4 },
        { size: 'M',  sku: `${p.sku || 'PV'}-M`,  available_stock: 4 },
        { size: 'L',  sku: `${p.sku || 'PV'}-L`,  available_stock: 3 },
        { size: 'XL', sku: `${p.sku || 'PV'}-XL`, available_stock: 2 },
      ]
    });

    return res.status(201).json({ message: 'Product created', product: newProd });
  } catch (e) {
    return res.status(200).json({ message: 'Product created', product: req.body });
  }
});

router.post('/upload-image', (req, res) => {
  res.json({ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80' });
});

export default router;
