import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  size: { type: String, required: true },
  color: { type: String, default: 'Default' },
  sku: { type: String, required: true },
  opening_stock: { type: Number, default: 0 },
  available_stock: { type: Number, default: 0 },
  reserved_stock: { type: Number, default: 0 },
  sold_stock: { type: Number, default: 0 },
  damaged_stock: { type: Number, default: 0 },
  selling_price_override_paise: { type: Number },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      return ret;
    }
  }
});

export const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  slug: { type: String },
  collection_id: { type: mongoose.Schema.Types.Mixed },
  collection_name: { type: String }, // cached for easy filtering
  category: { type: String, default: 'Dresses' },
  fabric: { type: String },
  color: { type: String },
  description: { type: String },
  cost_price_paise: { type: Number, default: 0 },
  selling_price_paise: { type: Number, default: 0 },
  discount_paise: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'archived', 'draft'], default: 'active' },
  image_url: { type: String },
  variants: [productVariantSchema],
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.selling_price_inr = (ret.selling_price_paise || 0) / 100;
      ret.cost_price_inr = (ret.cost_price_paise || 0) / 100;
      ret.discount_inr = (ret.discount_paise || 0) / 100;
      ret.available_stock = ret.variants ? ret.variants.reduce((sum, v) => sum + (v.available_stock || 0), 0) : 0;
      return ret;
    }
  }
});

export const Product = mongoose.model('Product', productSchema);
