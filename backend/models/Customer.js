import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customer_code: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp_number: { type: String },
  email: { type: String },
  date_of_birth: { type: String }, // e.g. "18 December" or "1998-12-18"
  city: { type: String },
  state: { type: String },
  pin_code: { type: String },
  shipping_address: { type: String },
  customer_source: { type: String, default: 'instagram' },
  marketing_consent: { type: Boolean, default: true },
  avatar_url: { type: String },
  total_orders: { type: Number, default: 0 },
  total_spent_paise: { type: Number, default: 0 },
  outstanding_paise: { type: Number, default: 0 },
  first_purchase_date: { type: String },
  last_purchase_date: { type: String },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.total_spent_inr = (ret.total_spent_paise || 0) / 100;
      ret.outstanding_inr = (ret.outstanding_paise || 0) / 100;
      return ret;
    }
  }
});

export const Customer = mongoose.model('Customer', customerSchema);
