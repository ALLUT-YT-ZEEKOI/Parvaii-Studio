import app from './app.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`✨ PARVAII Node.js Express Backend is Live!`);
  console.log(`🚀 Port: ${PORT} (http://127.0.0.1:${PORT})`);
  console.log(`🍃 Database: MongoDB Atlas (Cluster0: parvaii)`);
  console.log(`📡 API Base: http://127.0.0.1:${PORT}/api/v1`);
  console.log(`🌐 Production Subdomain Target: studio.parvaii.com`);
  console.log(`====================================================`);
});
