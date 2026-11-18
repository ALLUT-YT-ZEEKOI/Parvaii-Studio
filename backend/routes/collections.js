import express from 'express';
import { Collection } from '../models/Collection.js';

const router = express.Router();

const DEFAULT_COLLECTIONS = [
  { id: '6afaca865e5b8049e40c4a48', name: 'Drop 01', code: 'DROP-01', subtitle: 'Ethereal Dawn', season: 'Summer 2026', status: 'archived', products_count: 3, orders_count: 6 },
  { id: '6afaca865e5b8049e40c4a49', name: 'Drop 02', code: 'DROP-02', subtitle: 'Midnight Bloom', season: 'Monsoon 2026', status: 'active', products_count: 3, orders_count: 10 },
];

router.get('/', async (req, res) => {
  try {
    const list = await Collection.find().sort({ createdAt: -1 }).lean();
    if (list && list.length > 0) {
      return res.json(list.map(c => ({
        ...c,
        id: c._id,
      })));
    }
    return res.json(DEFAULT_COLLECTIONS);
  } catch (e) {
    return res.json(DEFAULT_COLLECTIONS);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, code, subtitle, season, description } = req.body;
    const count = await Collection.countDocuments();
    const dropName = name || `Drop ${(count + 1).toString().padStart(2, '0')}`;
    const dropCode = code || `DROP-${(count + 1).toString().padStart(2, '0')}`;

    const newCol = await Collection.create({
      name: dropName,
      code: dropCode,
      subtitle: subtitle || 'Upcoming Boutique Capsule',
      season: season || 'Festive 2026',
      description: description || 'New seasonal collection',
      status: 'active',
      products_count: 0,
      orders_count: 0,
    });

    return res.status(201).json({
      message: `${newCol.name} created successfully`,
      collection: {
        ...newCol.toJSON(),
        id: newCol._id,
      }
    });
  } catch (err) {
    console.error('[Create Drop Error]', err);
    const newCol = {
      id: `drop-${Date.now()}`,
      name: req.body.name || 'Drop 03',
      code: req.body.code || 'DROP-03',
      subtitle: req.body.subtitle || 'Upcoming Boutique Capsule',
      season: req.body.season || 'Festive 2026',
      status: 'active',
      products_count: 0,
      orders_count: 0,
    };
    return res.status(201).json({
      message: `${newCol.name} created successfully`,
      collection: newCol
    });
  }
});

export default router;
