import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true }, image_url: String,
  price: { type: Number, required: true, min: 0 }, quantity: { type: Number, required: true, min: 1 }, size: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true, validate: v => v.length > 0 },
  subtotal: { type: Number, required: true, min: 0 },
  shipping: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'], default: 'pending', index: true },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  paymentProvider: { type: String, default: 'upi' }, paymentReference: String,
  shippingAddress: { name: String, phone: String, address: String, city: String, state: String, pincode: String }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
