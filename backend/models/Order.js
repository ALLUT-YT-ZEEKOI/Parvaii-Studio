import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  product_variant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
  product_name: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit_price_paise: { type: Number, required: true },
  total_price_paise: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  order_number: { type: String, required: true, unique: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  collection_name: { type: String }, // cached for drop filtering (Drop 01, Drop 02)
  order_date: { type: String, required: true },
  subtotal_paise: { type: Number, default: 0 },
  discount_paise: { type: Number, default: 0 },
  delivery_charge_paise: { type: Number, default: 0 },
  total_amount_paise: { type: Number, required: true },
  received_amount_paise: { type: Number, default: 0 },
  balance_amount_paise: { type: Number, default: 0 },
  order_status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'sold', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['unpaid', 'partially_paid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  shipping_phone: { type: String },
  shipping_address: { type: String },
  courier_partner: { type: String },
  tracking_number: { type: String },
  items: [orderItemSchema],
  customer: {
    id: String,
    customer_code: String,
    full_name: String,
    phone: String,
    total_orders: Number,
    total_spent_inr: Number,
    outstanding_inr: Number,
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.subtotal_inr = (ret.subtotal_paise || 0) / 100;
      ret.discount_inr = (ret.discount_paise || 0) / 100;
      ret.delivery_charge_inr = (ret.delivery_charge_paise || 0) / 100;
      ret.total_inr = (ret.total_amount_paise || 0) / 100;
      ret.received_inr = (ret.received_amount_paise || 0) / 100;
      ret.balance_inr = (ret.balance_amount_paise || 0) / 100;
      if (ret.items) {
        ret.items = ret.items.map(it => ({
          ...it,
          id: it._id,
          unit_price_inr: (it.unit_price_paise || 0) / 100,
          total_price_inr: (it.total_price_paise || 0) / 100,
        }));
      }
      return ret;
    }
  }
});

export const Order = mongoose.model('Order', orderSchema);
