import mongoose from 'mongoose';
import Settings from './Settings.js';

const orderItemSchema = new mongoose.Schema({ product: { type: String, required: true }, name: { type: String, required: true }, image_url: String, price: { type: Number, required: true, min: 0 }, quantity: { type: Number, required: true, min: 1 }, size: String }, { _id: false });
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, index: true }, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, email: { type: String, required: true },
  items: { type: [orderItemSchema], required: true, validate: v => v.length > 0 }, subtotal: { type: Number, required: true, min: 0 }, shipping: { type: Number, default: 0, min: 0 }, gst: { type: Number, default: 0, min: 0 }, total: { type: Number, required: true, min: 0 }, currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'], default: 'pending', index: true }, paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' }, paymentProvider: { type: String, default: 'upi' }, paymentReference: String, estimatedDelivery: String,
  shippingAddress: { name: String, phone: String, address: String, apartment: String, city: String, state: String, pincode: String }
}, { timestamps: true });
orderSchema.pre('validate', async function(next) { try { if (!this.orderId) this.orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`; const s=await Settings.findOne({key:'upi_id'}).lean(); let cfg={delivery:49,gst:0}; try { if(s?.value){const parsed=JSON.parse(s.value);if(parsed&&typeof parsed==='object'){cfg.delivery=Math.max(0,Number(parsed.delivery)||0);cfg.gst=Math.max(0,Number(parsed.gst)||0)}} } catch {} const base=Number(this.subtotal)||0; this.shipping=base>=999?0:cfg.delivery; this.gst=Math.round(base*this.gst/100*100)/100; this.total=Math.round((base+this.shipping+this.gst)*100)/100; next(); } catch(e){next(e)} });
export default mongoose.model('Order', orderSchema);
