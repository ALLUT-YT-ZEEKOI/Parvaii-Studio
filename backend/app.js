import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import collectionRoutes from './routes/collections.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import productRoutes from './routes/products.js';
import inventoryRoutes from './routes/inventory.js';
import expenseRoutes from './routes/expenses.js';
import accountRoutes from './routes/accounts.js';
import reimbursementRoutes from './routes/reimbursements.js';
import purchaseRoutes from './routes/purchases.js';
import memberRoutes from './routes/members.js';
import reportRoutes from './routes/reports.js';
import settingRoutes from './routes/settings.js';

dotenv.config();

const app = express();

// Middleware: ensure MongoDB connection is active
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[DB Middleware Error]', err);
  }
  next();
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API V1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/reimbursements', reimbursementRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/settings', settingRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Node.js Express (Vercel Serverless & Dedicated Server Ready)',
    database: 'MongoDB Atlas',
    domain: 'studio.parvaii.com',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Node.js Express (Vercel Serverless & Dedicated Server Ready)',
    database: 'MongoDB Atlas',
    domain: 'studio.parvaii.com',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    app: 'PARVAII Atelier Brand ERP Backend',
    version: '1.0.0 (Node.js + Express)',
    database: 'MongoDB Atlas',
    endpoints: '/api/v1/'
  });
});

app.get('/', (req, res) => {
  res.json({
    app: 'PARVAII Atelier Brand ERP Backend',
    version: '1.0.0 (Node.js + Express)',
    database: 'MongoDB Atlas',
    endpoints: '/api/v1/'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
