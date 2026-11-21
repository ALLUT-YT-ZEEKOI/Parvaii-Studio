import express from 'express';
import { Collection } from '../models/Collection.js';
import { Expense } from '../models/Expense.js';
import { Product } from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await Collection.find().sort({ createdAt: 1 }).lean();
    return res.json(list.map(c => ({
      ...c,
      id: c._id,
    })));
  } catch (e) {
    return res.json([]);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, code, subtitle, season, category, description, launch_date, status } = req.body;
    const count = await Collection.countDocuments();
    const dropName = (name || `Drop ${(count + 1).toString().padStart(2, '0')}`).trim();
    let dropCode = (code || `DROP-${(count + 1).toString().padStart(2, '0')}`).trim().toUpperCase();

    const existingCode = await Collection.findOne({ code: dropCode });
    if (existingCode) {
      dropCode = `DROP-${Date.now().toString().slice(-6)}`;
    }

    const newCol = await Collection.create({
      name: dropName,
      code: dropCode,
      subtitle: subtitle || 'Upcoming Boutique Capsule',
      season: season || undefined,
      category: category || 'Dresses',
      launch_date: launch_date || undefined,
      description: description || 'New seasonal collection',
      status: ['active', 'archived', 'upcoming'].includes(status) ? status : 'active',
      products_count: 0,
      orders_count: 0,
    });

    return res.status(201).json({
      success: true,
      message: `${newCol.name} created successfully`,
      collection: {
        ...newCol.toJSON(),
        id: newCol._id,
      }
    });
  } catch (err) {
    console.error('[Create Drop Error]', err);
    const isConnErr = err.message?.includes('whitelist') || err.message?.includes('connect') || err.message?.includes('buffering timed out') || err.name === 'MongooseServerSelectionError';
    return res.status(isConnErr ? 503 : 500).json({
      success: false,
      error: 'Failed to create collection',
      message: isConnErr
        ? 'MongoDB Atlas is unreachable. Please whitelist 0.0.0.0/0 in MongoDB Atlas Network Access (cloud.mongodb.com).'
        : err.message,
      details: err.message
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const col = await Collection.findById(req.params.id);
    if (!col) {
      return res.status(404).json({ success: false, message: 'Drop not found' });
    }

    const oldName = col.name;
    const {
      name,
      code,
      subtitle,
      season,
      category,
      description,
      launch_date,
      status,
    } = req.body;

    if (typeof name === 'string' && name.trim()) col.name = name.trim();
    if (typeof code === 'string' && code.trim()) col.code = code.trim().toUpperCase();
    if (typeof subtitle === 'string') col.subtitle = subtitle.trim();
    if (typeof season === 'string') col.season = season.trim();
    if (typeof category === 'string' && category.trim()) col.category = category.trim();
    if (typeof description === 'string') col.description = description.trim();
    if (typeof launch_date === 'string') col.launch_date = launch_date;
    if (['active', 'archived', 'upcoming'].includes(status)) col.status = status;

    await col.save();

    // Keep expenses & products linked when drop name changes
    if (col.name !== oldName) {
      await Promise.all([
        Expense.updateMany({ collection_name: oldName }, { $set: { collection_name: col.name } }),
        Product.updateMany({ collection_name: oldName }, { $set: { collection_name: col.name } }),
      ]);
    }

    return res.json({
      success: true,
      message: `${col.name} updated`,
      collection: {
        ...col.toJSON(),
        id: col._id,
      },
      renamed_from: oldName !== col.name ? oldName : null,
    });
  } catch (err) {
    console.error('[Update Drop Error]', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to update drop',
    });
  }
});

export default router;
