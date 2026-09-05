import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donationId: { type: String, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  username: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  amount: { type: Number, required: true, min: 1 },
  purpose: { type: String, enum: ['coffee', 'relief'], required: true, index: true },
  campaign: { type: String, default: '' },
  paymentReference: { type: String, required: true, trim: true, maxlength: 100 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'rejected'], default: 'pending', index: true }
}, { timestamps: true });

donationSchema.pre('validate', function(next) {
  if (!this.donationId) this.donationId = `DON-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  next();
});

export default mongoose.model('Donation', donationSchema);
