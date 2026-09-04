import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = Router();
const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function hashOtp(otp) { return crypto.createHash('sha256').update(`${otp}:${process.env.OTP_SECRET || process.env.JWT_SECRET || 'development-only'}`).digest('hex'); }
function sign(user) { return jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' }); }
function mailer() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({ host: process.env.EMAIL_HOST, port: Number(process.env.EMAIL_PORT || 587), secure: String(process.env.EMAIL_PORT) === '465', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
}

router.post('/send-otp', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const name = String(req.body.name || '').trim().slice(0, 100);
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success:false, message:'Valid email is required' });
    let user = await User.findOne({ email }).select('+lastOtpSentAt');
    if (!user) user = await User.create({ email, name });
    if (user.lastOtpSentAt && Date.now() - user.lastOtpSentAt.getTime() < RESEND_MS) return res.status(429).json({ success:false, message:'Please wait before requesting another OTP' });
    const otp = String(crypto.randomInt(100000, 1000000));
    user.otpHash = hashOtp(otp); user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS); user.otpAttempts = 0; user.lastOtpSentAt = new Date();
    await user.save();
    const transport = mailer();
    if (!transport) return res.status(503).json({ success:false, message:'Email service is not configured' });
    await transport.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to: email, subject:'Your AccessStore verification code', text:`Your AccessStore OTP is ${otp}. It expires in 10 minutes. Do not share this code.` });
    res.json({ success:true, message:'OTP sent to your email' });
  } catch (e) { next(e); }
});

router.post('/verify-otp', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const otp = String(req.body.otp || '').trim();
    const user = await User.findOne({ email }).select('+otpHash +otpExpiresAt +otpAttempts');
    if (!user || !user.otpHash || !user.otpExpiresAt) return res.status(400).json({ success:false, message:'OTP not requested or expired' });
    if (user.otpAttempts >= MAX_ATTEMPTS) return res.status(429).json({ success:false, message:'Too many attempts. Request a new OTP.' });
    user.otpAttempts += 1;
    if (user.otpExpiresAt.getTime() < Date.now() || hashOtp(otp) !== user.otpHash) { await user.save(); return res.status(400).json({ success:false, message:'Invalid or expired OTP' }); }
    user.verified = true; user.otpHash = undefined; user.otpExpiresAt = undefined; user.otpAttempts = 0; await user.save();
    res.json({ success:true, token: sign(user), user:{ id:user._id, name:user.name, email:user.email, role:user.role } });
  } catch (e) { next(e); }
});

export default router;
