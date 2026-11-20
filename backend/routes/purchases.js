import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ data: [] });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Purchase recorded', data: req.body });
});

export default router;
