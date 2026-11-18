import mongoose from 'mongoose';

const accountTransactionSchema = new mongoose.Schema({
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { type: String, enum: ['credit', 'debit', 'transfer_in', 'transfer_out'], required: true },
  amount_paise: { type: Number, required: true },
  balance_after_paise: { type: Number, required: true },
  payment_mode: { type: String, default: 'bank_transfer' },
  reference_number: { type: String },
  reference_type: { type: String },
  transaction_date: { type: String, required: true },
  description: { type: String },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.amount_inr = (ret.amount_paise || 0) / 100;
      ret.balance_after_inr = (ret.balance_after_paise || 0) / 100;
      return ret;
    }
  }
});

export const AccountTransaction = mongoose.model('AccountTransaction', accountTransactionSchema);

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['bank', 'cash'], required: true },
  bank_name: { type: String },
  account_number: { type: String },
  ifsc_code: { type: String },
  branch: { type: String },
  opening_balance_paise: { type: Number, default: 0 },
  balance_paise: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  notes: { type: String },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.balance_inr = (ret.balance_paise || 0) / 100;
      ret.opening_balance_inr = (ret.opening_balance_paise || 0) / 100;
      return ret;
    }
  }
});

export const Account = mongoose.model('Account', accountSchema);
