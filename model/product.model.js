import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  ad: {
    type: String,
    required: [true, 'Məhsul adı tələb olunur'],
    trim: true,
    minlength: [2, 'Məhsul adı ən azı 2 simvol olmalıdır'],
    maxlength: [100, 'Məhsul adı 100 simvoldan çox ola bilməz']
  },
  qiymet: {
    type: Number,
    required: [true, 'Qiymət tələb olunur'],
    min: [0, 'Qiymət mənfi ola bilməz']
  },
  sekil: {
    type: String,
    default: null,
    trim: true
    // Şəkil URL və ya file path saxlanacaq
    // Məsələn: /uploads/products/mehsul-1234567890.jpg
  },
  tesvir: {
    type: String,
    trim: true,
    maxlength: [500, 'Təsvir 500 simvoldan çox ola bilməz'],
    default: ''
  },
  ceki: {
    type: Number,
    min: [0, 'Çəki mənfi ola bilməz'],
    default: 0
    // Çəki gram ilə saxlanacaq
  }
}, {
  timestamps: true // createdAt və updatedAt avtomatik əlavə olunur
});

// Virtual field - şəkil URL-ni tam olaraq qaytarmaq üçün (optional)
productSchema.virtual('sekilURL').get(function() {
  if (this.sekil) {
    return `${process.env.BASE_URL || 'http://localhost:8888'}${this.sekil}`;
  }
  return null;
});

// JSON-a çevirərkən virtual field-ləri daxil et
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;