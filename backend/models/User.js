import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'partner', 'staff'], default: 'partner' },
  phone: { type: String },
  avatar_url: { type: String },
  equity_percentage: { type: Number, default: 0 },
  title: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  last_login_at: { type: Date },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret.password;
      return ret;
    }
  }
});

export const User = mongoose.model('User', userSchema);
