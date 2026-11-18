import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    company: {
      name: 'PARVAII',
      legal_name: 'Parvaii Apparel LLP',
      brand_tagline: 'Clothing Brand Management System',
      currency: 'INR',
      currency_symbol: '₹',
      phone: '+91 98400 12345',
      email: 'studio@parvaii.com',
      address: 'Plot 42, Design District, Chennai, Tamil Nadu 600028',
      gst_number: '33AAACP1234M1Z5',
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    categories: ['Tops', 'Dresses', 'Kurtis', 'Co-ords', 'Sarees', 'Bottoms'],
  });
});

router.post('/', (req, res) => {
  res.json({ message: 'Settings saved' });
});

router.get('/audit-logs', (req, res) => {
  res.json({ data: [] });
});

export default router;
