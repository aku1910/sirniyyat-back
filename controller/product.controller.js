import Product from '../model/product.model.js';
import fs from 'fs';
import path from 'path';

// ✅ 1. Bütün məhsulları əldə et (GET ALL)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('❌ Get all products xətası:', error);
    res.status(500).json({
      success: false,
      message: 'Server xətası',
      error: error.message
    });
  }
};

// ✅ 2. Tək məhsul əldə et (GET SINGLE)
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Məhsul tapılmadı'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('❌ Get single product xətası:', error);
    res.status(500).json({
      success: false,
      message: 'Server xətası',
      error: error.message
    });
  }
};

// ✅ 3. Yeni məhsul yarat (CREATE) - Şəkil ilə
export const createProduct = async (req, res) => {
  try {
    console.log('📥 Gələn req.body:', req.body);
    console.log('📥 Gələn req.file:', req.file);

    const { ad, qiymet, tesvir, ceki } = req.body;

    // Validation
    if (!ad || !qiymet) {
      return res.status(400).json({
        success: false,
        message: 'Ad və qiymət tələb olunur'
      });
    }

    // Şəkil yüklənibmi?
    const sekil = req.file ? `/uploads/products/${req.file.filename}` : null;

    // FormData string olaraq göndərir, number-ə çevir
    const qiymetNumber = parseFloat(qiymet);
    const cekiNumber = ceki ? parseFloat(ceki) : 0;

    const newProduct = new Product({
      ad,
      qiymet: qiymetNumber,
      sekil,
      tesvir: tesvir || '',
      ceki: cekiNumber
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: '✅ Məhsul uğurla yaradıldı',
      product: newProduct
    });
  } catch (error) {
    console.error('❌ Create product xətası:', error);

    // Əgər xəta olarsa, yüklənmiş şəkli sil
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server xətası',
      error: error.message
    });
  }
};

// ✅ 4. Məhsul yenilə (UPDATE) - Şəkil ilə
// ✅ 4. Məhsul yenilə (UPDATE) - Düzəldilmiş
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ req.body undefined ola bilər (yalnız şəkil yüklənəndə)
    const { ad, qiymet, tesvir, ceki } = req.body || {};

    const product = await Product.findById(id);

    if (!product) {
      // Əgər məhsul tapılmasa və şəkil yüklənibsə, şəkli sil
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Məhsul tapılmadı'
      });
    }

    // Əgər yeni şəkil yüklənibsə, köhnəni sil
    if (req.file) {
      if (product.sekil) {
        const oldImagePath = path.join(process.cwd(), product.sekil);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.sekil = `/uploads/products/${req.file.filename}`;
    }

    // Yeniləmə (yalnız göndərilən sahələr)
    if (ad !== undefined) product.ad = ad;
    if (qiymet !== undefined) product.qiymet = parseFloat(qiymet);
    if (tesvir !== undefined) product.tesvir = tesvir;
    if (ceki !== undefined) product.ceki = parseFloat(ceki);

    await product.save();

    res.status(200).json({
      success: true,
      message: '✅ Məhsul uğurla yeniləndi',
      product
    });
  } catch (error) {
    console.error('❌ Update product xətası:', error);

    // Əgər xəta olarsa, yüklənmiş şəkli sil
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server xətası',
      error: error.message
    });
  }
};

// ✅ 5. Məhsul sil (DELETE)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Məhsul tapılmadı'
      });
    }

    // Şəkili sil
    if (product.sekil) {
      const imagePath = path.join(process.cwd(), product.sekil);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: '✅ Məhsul uğurla silindi'
    });
  } catch (error) {
    console.error('❌ Delete product xətası:', error);
    res.status(500).json({
      success: false,
      message: 'Server xətası',
      error: error.message
    });
  }
};