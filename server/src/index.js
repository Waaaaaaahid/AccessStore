import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const app = express();
const clientOrigins = process.env.CLIENT_URL?.split(',').map(v => v.trim()).filter(Boolean);
app.use(cors({ origin: clientOrigins?.length ? clientOrigins : true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String, email: String, phone: String,
  address: mongoose.Schema.Types.Mixed,
  items: [{ productId: String, name: String, price: Number, quantity: Number, image: String }],
  subtotal: Number, shipping: Number, discount: Number, total: Number,
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending_payment','paid','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','refund_initiated','refunded'], default: 'pending_payment' },
  payment: mongoose.Schema.Types.Mixed,
  couponCode: String,
  createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now }
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many authentication attempts. Please try again later.' } });

function publicUser(user) { return { id: user._id.toString(), name: user.name || '', email: user.email, role: user.role }; }
function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(payload.sub).then(user => {
      if (!user) return res.status(401).json({ error: 'Invalid or expired session' });
      req.user = user;
      next();
    }).catch(next);
  } catch { return res.status(401).json({ error: 'Invalid or expired session' }); }
}
function admin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'AccessStore API' }));

app.post('/api/auth/register', authLimiter, async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim().slice(0, 100);
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ error: 'An account with this email already exists' });
    next(e);
  }
});

app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
});

app.get('/api/auth/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));

app.post('/api/auth/logout', (_req, res) => res.json({ success: true }));

app.post('/api/orders', auth, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user._id, email: req.user.email, name: req.user.name });
    res.status(201).json({ data: order, error: null });
  } catch (e) { res.status(400).json({ data: null, error: e.message }); }
});

app.get('/api/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ data: orders, error: null });
  } catch (e) { res.status(500).json({ data: null, error: e.message }); }
});

app.get('/api/orders/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ data: null, error: 'Order not found' });
    res.json({ data: order, error: null });
  } catch (e) { res.status(400).json({ data: null, error: e.message }); }
});

app.patch('/api/admin/orders/:id/status', auth, admin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus, payment } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus, paymentStatus, payment, updatedAt: new Date() }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ data: null, error: 'Order not found' });
    res.json({ data: order, error: null });
  } catch (e) { res.status(400).json({ data: null, error: e.message }); }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 5000);
if (!process.env.MONGO_URI) { console.error('MONGO_URI is required'); process.exit(1); }
if (!process.env.JWT_SECRET) { console.error('JWT_SECRET is required'); process.exit(1); }
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`AccessStore API listening on ${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
