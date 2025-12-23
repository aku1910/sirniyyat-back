import express from 'express';
import upload from '../config/multer.config.js';
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controller/product.controller.js';

const router = express.Router();

// ========================================
// 📦 PUBLIC ROUTES (Token tələb olunmur)
// ========================================

// 1️⃣ Bütün məhsulları əldə et
router.get('/', getAllProducts);

// 2️⃣ Tək məhsul əldə et
router.get('/:id', getSingleProduct);

// 3️⃣ Yeni məhsul yarat (Şəkil ilə)
router.post('/', upload.single('sekil'), createProduct);

// 4️⃣ Məhsul yenilə (Şəkil ilə)
router.put('/:id', upload.single('sekil'), updateProduct);

// 5️⃣ Məhsul sil
router.delete('/:id', deleteProduct);

export default router;