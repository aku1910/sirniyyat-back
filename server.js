import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Routes
import productRoutes from './router/product.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;
const httpServer = createServer(app);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

// Middleware-lər
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));

// Static fayllar (Şəkillər üçün)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// "uploads/products" qovluğunu yarat (əgər yoxdursa)
const uploadDir = path.join(process.cwd(), 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ "uploads/products" qovluğu yaradıldı');
}

// Routes
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API hazırdır',
    endpoints: {
      products: '/api/products',
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tapılmadı'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server xətası',
    error: err.message
  });
});

// Server başlat
httpServer.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
});