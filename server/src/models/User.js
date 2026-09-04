import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 100, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer', index: true }
}, { timestamps: true, versionKey: false });

export default mongoose.model('User', userSchema);
