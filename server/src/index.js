import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(',').map(v => v.trim()) || true }));
app.use(express.json({ limit: '1mb' }));

const schema = new mongoose.Schema({
  name: String, email: { type: String, index: true }, phone: String,
  address: mongoose.Schema.Types.Mixed,
  items: [{ productId: String, name: String, price: Number, quantity: Number, image: String }],
  subtotal: Number, shipping: Number, discount: Number, total: Number,
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending_payment','paid','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','refund_initiated','refunded'], default: 'pending_payment' },
  payment: mongoose.Schema.Types.Mixed,
  couponCode: String,
  createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', schema);

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'AccessStore API' }));

app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ data: order, error: null });
  } catch (e) { res.status(400).json({ data: null, error: e.message }); }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ data: null, error: 'Order not found' });
    res.json({ data: order, error: null });
  } catch (e) { res.status(400).json({ data: null, error: e.message }); }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { orderStatus, paymentStatus, payment } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus, paymentStatus, payment, updatedAt: new Date() }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ data: null, error: 'Order not found' });
    res.json({ data: order, error: null });
  } catch (e) { res.status(400).json({ data: null, error: e.message }); }
});

const port = Number(process.env.PORT || 5000);
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`AccessStore API listening on ${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
