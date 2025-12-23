import multer from 'multer';
import path from 'path';

// Şəkillərin saxlanacağı yer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/'); // Şəkillər bu qovluğa yüklənəcək
  },
  filename: function (req, file, cb) {
    // Unikal fayl adı: mehsul-1234567890.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'mehsul-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Fayl tipini yoxla (yalnız şəkillərə icazə ver)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Yalnız şəkil faylları yükləyə bilərsiniz (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum 5MB
  fileFilter: fileFilter
});

export default upload;