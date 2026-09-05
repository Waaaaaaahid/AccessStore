import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Payment from './models/Payment.js';
import Order from './models/Order.js';
import { broadcast } from './realtime.js';

const originalListen = express.application.listen;
let app;
express.application.listen = function (...args) {
  app = this;
  return originalListen.apply(this, args);
};

await import('./index.js');

const getUser = async (req) => {
  const raw = req.headers.authorization || '';
  if (!raw.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(raw.slice(7), process.env.JWT_SECRET);
    return await User.findById(payload.sub);
  } catch { return null; }
};
const requireUser = async (req,res,next) => {
  const user = await getUser(req);
  if (!user) return res.status(401).json({error:'Authentication required'});
  req.user = user; next();
};
const requireAdmin = async (req,res,next) => {
  const user = await getUser(req);
  if (!user) return res.status(401).json({error:'Authentication required'});
  if (user.role !== 'admin') return res.status(403).json({error:'Admin access required'});
  req.user = user; next();
};

app.post('/api/payments', requireUser, async (req,res,next) => {
  try {
    const amount = Math.round(Number(req.body.amount) * 100) / 100;
    const utr = String(req.body.utr || '').trim().replace(/\s+/g,' ').slice(0,100);
    const purpose = String(req.body.purpose || '').trim().slice(0,150);
    const source = ['buy_me_a_coffee','relief','other'].includes(req.body.source) ? req.body.source : 'other';
    const campaign = String(req.body.campaign || '').trim().slice(0,150);
    if (!Number.isFinite(amount) || amount < 1) return res.status(400).json({error:'Enter a valid payment amount'});
    if (!purpose) return res.status(400).json({error:'Payment purpose is required'});
    if (!utr || utr.length < 6) return res.status(400).json({error:'Enter a valid UTR / transaction reference'});
    const payment = await Payment.create({user:req.user._id,username:req.user.name || req.user.email,email:req.user.email,amount,purpose,source,campaign,utr,status:'pending'});
    const out={id:String(payment._id),username:payment.username,email:payment.email,amount:payment.amount,purpose:payment.purpose,source:payment.source,campaign:payment.campaign||'',utr:payment.utr,status:payment.status,created_at:payment.createdAt};
    broadcast('payment_submitted',{payment:out});
    res.status(201).json({success:true,payment:out,message:'UTR submitted. Payment is pending admin verification.'});
  } catch(e) { next(e); }
});

app.get('/api/admin/payments', requireAdmin, async (req,res,next) => {
  try {
    const standalone = await Payment.find().sort({createdAt:-1}).lean();
    const orders = await Order.find({paymentReference:{$exists:true,$nin:[null,'']}}).sort({updatedAt:-1}).lean();
    const rows = [
      ...standalone.map(p=>({id:String(p._id),kind:'payment',username:p.username,email:p.email||'',amount:p.amount,purpose:p.purpose,source:p.source,campaign:p.campaign||'',utr:p.utr,status:p.status,created_at:p.createdAt,verified_at:p.verifiedAt||null})),
      ...orders.map(o=>({id:String(o._id),kind:'order',username:o.shippingAddress?.name||'',email:o.email||'',amount:o.total,purpose:`Product purchase — ${o.orderId}`,source:'product_purchase',campaign:o.orderId,utr:o.paymentReference,status:o.paymentStatus==='paid'?'verified':o.paymentStatus==='failed'?'rejected':'pending',created_at:o.createdAt,verified_at:o.paymentStatus==='paid'?o.updatedAt:null,order_id:o.orderId}))
    ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    res.json({payments:rows});
  } catch(e) { next(e); }
});

app.patch('/api/admin/payments/:id', requireAdmin, async (req,res,next) => {
  try {
    const status=String(req.body.status||'').toLowerCase();
    if (!['pending','verified','rejected'].includes(status)) return res.status(400).json({error:'Invalid payment status'});
    const standalone=await Payment.findById(req.params.id);
    if (standalone) {
      standalone.status=status;
      standalone.verifiedAt=status==='verified'?new Date():undefined;
      standalone.verifiedBy=status==='verified'?req.user._id:undefined;
      await standalone.save();
      const out={id:String(standalone._id),kind:'payment',username:standalone.username,email:standalone.email||'',amount:standalone.amount,purpose:standalone.purpose,source:standalone.source,campaign:standalone.campaign||'',utr:standalone.utr,status:standalone.status,created_at:standalone.createdAt,verified_at:standalone.verifiedAt||null};
      broadcast('payment_updated',{payment:out});
      return res.json({success:true,payment:out});
    }
    const order=await Order.findById(req.params.id);
    if (!order) return res.status(404).json({error:'Payment not found'});
    order.paymentStatus=status==='verified'?'paid':status==='rejected'?'failed':'pending';
    await order.save();
    const out={id:String(order._id),kind:'order',username:order.shippingAddress?.name||'',email:order.email||'',amount:order.total,purpose:`Product purchase — ${order.orderId}`,source:'product_purchase',campaign:order.orderId,utr:order.paymentReference,status,created_at:order.createdAt,verified_at:status==='verified'?order.updatedAt:null,order_id:order.orderId};
    broadcast('payment_updated',{payment:out});
    broadcast('order_updated',{order:{id:String(order._id),order_id:order.orderId,payment_status:order.paymentStatus}});
    res.json({success:true,payment:out});
  } catch(e) { next(e); }
});
