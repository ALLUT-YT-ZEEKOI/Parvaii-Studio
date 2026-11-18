import mongoose from 'mongoose';

const expenseCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  color: { type: String },
  description: { type: String },
  is_custom: { type: Boolean, default: false },
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

export const ExpenseCategory = mongoose.model('ExpenseCategory', expenseCategorySchema);

const expenseSchema = new mongoose.Schema({
  expense_number: { type: String, required: true, unique: true },
  expense_date: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseCategory' },
  category_name: { type: String, required: true },
  description: { type: String, required: true },
  amount_paise: { type: Number, required: true },
  funding_source: {
    type: String,
    enum: ['company_account', 'personal_member', 'unpaid_supplier', 'split'],
    required: true,
  },
  company_account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  paid_by_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paid_by_member: {
    id: String,
    name: String,
    role: String,
    email: String,
    status: String,
  },
  payment_mode: { type: String, default: 'upi' },
  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  collection_name: { type: String }, // cached for drop filtering
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  reference_number: { type: String },
  status: { type: String, enum: ['approved', 'pending', 'cancelled'], default: 'approved' },
  notes: { type: String },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.amount_inr = (ret.amount_paise || 0) / 100;
      return ret;
    }
  }
});

export const Expense = mongoose.model('Expense', expenseSchema);
