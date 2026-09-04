import { Router } from 'express';
import Product from '../models/Product.js';
const router = Router();
router.get('/', async (_req,res,next)=>{ try { res.json({success:true, products:await Product.find({is_active:true}).sort({createdAt:-1}).lean()}); } catch(e){next(e)} });
router.get('/:slug', async (req,res,next)=>{ try { const product=await Product.findOne({slug:req.params.slug,is_active:true}).lean(); if(!product) return res.status(404).json({success:false,message:'Product not found'}); res.json({success:true,product}); } catch(e){next(e)} });
export default router;
