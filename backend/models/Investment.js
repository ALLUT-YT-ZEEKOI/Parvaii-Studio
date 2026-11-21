import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  amount_paise: { type: Number, required: true },
  investment_type: {
    type: String,
    enum: ['initial_capital', 'additional_capital'],
    default: 'initial_capital',
  },
  notes: { type: String },
  transaction_date: { type: String, required: true },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.amount_inr = (ret.amount_paise || 0) / 100;
      return ret;
    },
  },
});

export const Investment = mongoose.model('Investment', investmentSchema);
