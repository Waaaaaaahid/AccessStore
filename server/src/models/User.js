import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  verified: { type: Boolean, default: false },
  otpHash: { type: String, select: false },
  otpExpiresAt: { type: Date, select: false },
  otpAttempts: { type: Number, default: 0, select: false },
  lastOtpSentAt: { type: Date, select: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
