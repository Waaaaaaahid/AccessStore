import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import User from './models/User.js';

const products = [
  {name:'Cosmic Byte Raptor Wireless Gaming Mouse',slug:'cosmic-byte-raptor-wireless-gaming-mouse',description:'Lightweight wireless gaming mouse for FPS and everyday gaming.',short_description:'Wireless gaming mouse with RGB and precise tracking.',price:899,original_price:1999,image_url:'https://images.unsplash.com/photo-1527814050087-3793815479db?w=900&q=85',category:'Gaming Mice',stock:25,is_featured:true,is_new:true,rating:4.4,review_count:860},
  {name:'Cosmic Byte Firestorm Gaming Mouse',slug:'cosmic-byte-firestorm-gaming-mouse',description:'Wired ambidextrous optical gaming mouse built for responsive gameplay.',short_description:'Responsive wired gaming mouse for PC gamers.',price:999,original_price:1499,image_url:'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=900&q=85',category:'Gaming Mice',stock:25,is_featured:true,rating:4.4,review_count:1200},
  {name:'EVOFOX Katana X2 Mechanical Gaming Keyboard',slug:'evofox-katana-x2-mechanical-gaming-keyboard',description:'Mechanical gaming keyboard with dynamic backlighting and anti-ghosting.',short_description:'RGB mechanical keyboard for competitive gaming.',price:1999,original_price:3499,image_url:'https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=85',category:'Gaming Keyboards',stock:20,is_featured:true,is_new:true,rating:4.6,review_count:904},
  {name:'Kreo Hive RGB 75% Mechanical Gaming Keyboard',slug:'kreo-hive-rgb-75-mechanical-keyboard',description:'Compact 75% mechanical gaming keyboard with RGB lighting.',short_description:'Compact hot-swap style gaming keyboard.',price:3199,original_price:4600,image_url:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&q=85',category:'Gaming Keyboards',stock:18,is_featured:true,rating:4.6,review_count:476},
  {name:'SpinBot Rage MK61 60% Gaming Keyboard',slug:'spinbot-rage-mk61-gaming-keyboard',description:'Compact 60% RGB keyboard with anti-ghosting keys.',short_description:'Budget compact RGB keyboard for gamers.',price:1299,original_price:2999,image_url:'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=900&q=85',category:'Gaming Keyboards',stock:25,rating:4.4,review_count:140},
  {name:'Cosmic Byte GS430 RGB Gaming Headset',slug:'cosmic-byte-gs430-rgb-gaming-headset',description:'Over-ear gaming headset with RGB lighting and microphone.',short_description:'RGB over-ear headset with gaming microphone.',price:1305,original_price:1499,image_url:'https://images.unsplash.com/photo-1599669454699-248893623440?w=900&q=85',category:'Gaming Headsets',stock:25,is_featured:true,rating:4.3,review_count:13000},
  {name:'EVOFOX One S Wireless Gaming Controller',slug:'evofox-one-s-wireless-controller',description:'Universal 3-mode wireless and wired Bluetooth gamepad for PC and mobile.',short_description:'Wireless multi-platform controller for gamers.',price:1599,original_price:2299,image_url:'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=900&q=85',category:'Gaming Controllers',stock:20,is_featured:true,rating:4.4,review_count:1900},
  {name:'Cosmic Byte Ares Tri-Mode Wireless Gamepad',slug:'cosmic-byte-ares-tri-mode-gamepad',description:'Tri-mode wireless gamepad compatible with PC, Android and iOS.',short_description:'Tri-mode controller for PC and mobile gaming.',price:1799,original_price:3499,image_url:'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=900&q=85',category:'Gaming Controllers',stock:20,rating:4.4,review_count:1900},
  {name:'Sony DualSense Wireless Controller',slug:'sony-dualsense-wireless-controller',description:'Official PlayStation 5 wireless controller with haptic feedback and adaptive triggers.',short_description:'Premium PS5 wireless gaming controller.',price:5679,original_price:5999,image_url:'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=900&q=85',category:'Gaming Controllers',stock:10,is_featured:true,rating:4.7,review_count:4000},
  {name:'ZEBRONICS Zeb-MSP X1 Gaming Mouse Pad',slug:'zebronics-zeb-msp-x1-gaming-mouse-pad',description:'Large non-slip gaming mouse pad designed for smooth mouse movement.',short_description:'Large desk-friendly gaming mouse pad.',price:99,original_price:299,image_url:'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=900&q=85',category:'Gaming Mousepads',stock:40,is_new:true,rating:4.6,review_count:72},
  {name:'XXL Extended RGB Gaming Desk Mat',slug:'xxl-extended-rgb-gaming-desk-mat',description:'Extended desk mat for keyboard and mouse with a gamer-focused setup look.',short_description:'XXL desk mat for keyboard and mouse.',price:699,original_price:1299,image_url:'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=900&q=85',category:'Gaming Mousepads',stock:30,is_new:true,rating:4.3,review_count:500},
  {name:'GTPLAYER Ergonomic Gaming Chair',slug:'gtplayer-ergonomic-gaming-chair',description:'Ergonomic gaming chair designed for long gaming sessions.',short_description:'Gaming chair for long sessions and setups.',price:10999,original_price:15999,image_url:'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=85',category:'Gaming Chairs',stock:8,is_featured:true,rating:4.4,review_count:800},
  {name:'Logitech G PRO X Superlight 2 Gaming Mouse',slug:'logitech-g-pro-x-superlight-2',description:'60g professional wireless gaming mouse with HERO 2 sensor and up to 32000 DPI.',short_description:'Pro-grade lightweight wireless gaming mouse.',price:10999,original_price:14999,image_url:'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=900&q=85',category:'Gaming Mice',stock:8,is_featured:true,rating:4.4,review_count:140},
  {name:'Frontech Quantum Striker RGB Gaming Combo',slug:'frontech-quantum-striker-rgb-combo',description:'Gaming keyboard and mouse combo with RGB-style backlighting.',short_description:'Affordable gaming keyboard and mouse combo.',price:767,original_price:2200,image_url:'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=900&q=85',category:'Gaming Combos',stock:30,rating:4.1,review_count:521},
  {name:'Gaming USB Microphone for Streaming',slug:'gaming-usb-microphone-streaming',description:'USB desktop microphone for gaming voice chat, streaming and content creation.',short_description:'Plug-and-play microphone for gamers and streamers.',price:1499,original_price:2499,image_url:'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&q=85',category:'Streaming Gear',stock:20,is_new:true,rating:4.3,review_count:700},
  {name:'RGB Laptop Cooling Pad for Gaming',slug:'rgb-laptop-cooling-pad-gaming',description:'Multi-fan laptop cooling stand with RGB lighting for gaming setups.',short_description:'Cooling stand for gaming laptops.',price:749,original_price:1599,image_url:'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=900&q=85',category:'Gaming Accessories',stock:25,rating:4.2,review_count:842},
  {name:'Gaming Thumb Grip Caps 8-Pack',slug:'gaming-thumb-grip-caps-8-pack',description:'Anti-slip silicone thumb grips for console and mobile controllers.',short_description:'Controller grip caps for better gaming control.',price:199,original_price:399,image_url:'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=900&q=85',category:'Gaming Accessories',stock:50,is_new:true,rating:4.2,review_count:300},
  {name:'5-in-1 RGB Gaming Accessories Combo',slug:'5-in-1-rgb-gaming-accessories-combo',description:'Budget-friendly gaming setup combo with keyboard, mouse and useful desk accessories.',short_description:'Starter RGB gaming setup combo.',price:1299,original_price:2499,image_url:'https://images.unsplash.com/photo-1598550478831-5a9c1f6e8a0f?w=900&q=85',category:'Gaming Combos',stock:20,is_featured:true,is_new:true,rating:4.1,review_count:600}
];

await mongoose.connect(process.env.MONGO_URI);
for (const product of products) await Product.updateOne({slug:product.slug},{$set:{...product,is_active:true}},{upsert:true});
console.log(`Ensured ${products.length} gaming products are active in MongoDB`);

const adminEmail=String(process.env.ADMIN_EMAIL||'').trim().toLowerCase();
const adminPassword=String(process.env.ADMIN_PASSWORD||'');
if(adminEmail&&adminPassword){
  const passwordHash=await bcrypt.hash(adminPassword,12);
  const existing=await User.findOne({email:adminEmail}).select('+passwordHash');
  if(!existing){
    await User.create({name:'Administrator',email:adminEmail,passwordHash,role:'admin'});
    console.log(`Ensured admin account exists: ${adminEmail}`);
  }else{
    existing.name=existing.name||'Administrator';existing.role='admin';existing.passwordHash=passwordHash;await existing.save();
    console.log(`Synced admin account: ${adminEmail}`);
  }
}else console.log('ADMIN_EMAIL / ADMIN_PASSWORD not configured; admin seed skipped');
await mongoose.disconnect();
