import mongoose from 'mongoose';

const reimbursementSchema = new mongoose.Schema({
  reimbursement_number: { type: String, required: true, unique: true },
  expense_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claim_amount_paise: { type: Number, required: true },
  settled_amount_paise: { type: Number, default: 0 },
  outstanding_amount_paise: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'partial', 'paid', 'rejected'], default: 'pending' },
  claim_date: { type: String, required: true },
  notes: { type: String },
  member: {
    id: String,
    name: String,
    role: String,
    email: String,
  },
  expense: {
    id: String,
    expense_number: String,
    description: String,
    category_name: String,
    amount_inr: Number,
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.claim_inr = (ret.claim_amount_paise || 0) / 100;
      ret.settled_inr = (ret.settled_amount_paise || 0) / 100;
      ret.outstanding_inr = (ret.outstanding_amount_paise || 0) / 100;
      return ret;
    }
  }
});

export const Reimbursement = mongoose.model('Reimbursement', reimbursementSchema);

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact_person: { type: String },
  phone: { type: String },
  email: { type: String },
  city: { type: String },
  state: { type: String },
  gst_number: { type: String },
  outstanding_payable_paise: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.outstanding_payable_inr = (ret.outstanding_payable_paise || 0) / 100;
      return ret;
    }
  }
});

export const Supplier = mongoose.model('Supplier', supplierSchema);

const purchaseItemSchema = new mongoose.Schema({
  material_type: { type: String, required: true },
  item_name: { type: String, required: true },
  unit: { type: String, default: 'meters' },
  quantity: { type: Number, required: true },
  unit_price_paise: { type: Number, default: 0 },
  total_amount_paise: { type: Number, default: 0 },
});

const purchaseSchema = new mongoose.Schema({
  purchase_number: { type: String, required: true, unique: true },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  supplier_name: { type: String },
  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  collection_name: { type: String },
  purchase_date: { type: String, required: true },
  total_paise: { type: Number, required: true },
  paid_paise: { type: Number, default: 0 },
  balance_paise: { type: Number, default: 0 },
  payment_status: { type: String, enum: ['unpaid', 'partially_paid', 'paid'], default: 'unpaid' },
  payment_source: { type: String, default: 'company_account' },
  bill_number: { type: String },
  status: { type: String, enum: ['received', 'ordered', 'cancelled'], default: 'received' },
  items: [purchaseItemSchema],
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.total_inr = (ret.total_paise || 0) / 100;
      ret.paid_inr = (ret.paid_paise || 0) / 100;
      ret.balance_inr = (ret.balance_paise || 0) / 100;
      return ret;
    }
  }
});

export const Purchase = mongoose.model('Purchase', purchaseSchema);
