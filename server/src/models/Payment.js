import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, index: true },
  username: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, trim: true, maxlength: 200 },
  amount: { type: Number, required: true, min: 1 },
  purpose: { type: String, required: true, trim: true, maxlength: 150 },
  source: { type: String, enum: ['buy_me_a_coffee','relief','other'], default: 'other', index: true },
  campaign: { type: String, trim: true, maxlength: 150 },
  utr: { type: String, required: true, trim: true, maxlength: 100, index: true },
  status: { type: String, enum: ['pending','verified','rejected'], default: 'pending', index: true },
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

paymentSchema.index({ createdAt: -1 });
export default mongoose.model('Payment', paymentSchema);
