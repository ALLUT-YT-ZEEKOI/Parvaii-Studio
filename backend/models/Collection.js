import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  subtitle: { type: String },
  season: { type: String },
  launch_date: { type: String },
  status: { type: String, enum: ['active', 'archived', 'upcoming'], default: 'active' },
  description: { type: String },
  products_count: { type: Number, default: 0 },
  orders_count: { type: Number, default: 0 },
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

export const Collection = mongoose.model('Collection', collectionSchema);
