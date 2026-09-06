import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import User from './models/User.js';

// Curated from live Flipkart listings checked on 5 Sep 2026. Keep only real products
// with a retailer page so an admin can open the exact source listing when fulfilling an order.
const products = [
  {
    name:'Cosmic Byte Raptor Right Handed Optical Gaming Mouse',
    slug:'cosmic-byte-raptor-right-handed-gaming-mouse',
    description:'Cosmic Byte Raptor right-handed 2.4GHz wireless gaming mouse with a responsive optical sensor, ergonomic shape and gaming-focused controls.',
    short_description:'Wireless gaming mouse with 2.4GHz connectivity and ergonomic design.',
    price:899, original_price:1999,
    image_url:'https://cdns3.thecosmicbyte.com/wp-content/uploads/00.jpg.webp',
    category:'Gaming Mice', source_store:'Flipkart',
    source_url:'https://www.flipkart.com/cosmic-byte-raptor-wireless-right-handed-optical-gaming-mouse/p/itm1683cbe52bca5',
    stock:10,is_featured:true,is_new:true,rating:4.5,review_count:62,tags:['gaming mouse','wireless','cosmic byte']
  },
  {
    name:'Logitech G304 LIGHTSPEED Wireless Gaming Mouse',
    slug:'logitech-g304-lightspeed-wireless-gaming-mouse',
    description:'Logitech G304 LIGHTSPEED wireless gaming mouse with HERO sensor, 200–12000 DPI, 1000Hz report rate, six programmable buttons and up to 250 hours of battery life.',
    short_description:'HERO sensor wireless gaming mouse with LIGHTSPEED connectivity.',
    price:2795, original_price:3795,
    image_url:'https://cdn2.cybermall.ru/images/products/003/336/541/big/32501962_1.jpg',
    category:'Gaming Mice', source_store:'Flipkart',
    source_url:'https://www.flipkart.com/logitech-g304-wireless-ambidextrous-optical-gaming-mouse-bluetooth/p/itm2a2172425fd8e',
    stock:10,is_featured:true,rating:4.5,review_count:1713,tags:['gaming mouse','wireless','logitech','g304']
  },
  {
    name:'Cosmic Byte Spectrum RGB 12800DPI Gaming Mouse',
    slug:'cosmic-byte-spectrum-rgb-12800dpi-gaming-mouse',
    description:'Cosmic Byte Spectrum RGB wired ambidextrous gaming mouse with 66g lightweight honeycomb design, 12800 DPI, 1000Hz polling and 10-million-click switches.',
    short_description:'66g RGB wired gaming mouse with 12800 DPI and 1000Hz polling.',
    price:699, original_price:1499,
    image_url:'https://vishalperipherals.com/cdn/shop/files/TCBP03429.png?v=1729801631',
    category:'Gaming Mice', source_store:'Flipkart',
    source_url:'https://www.flipkart.com/cosmic-byte-spectrum-rgb-66grams-12800dpi-1000hz-polling-10m-switches-software-support-wired-optical-gaming-mouse/p/itmced3f91e0ee8e',
    stock:10,is_featured:true,is_new:true,rating:4.6,review_count:14,tags:['gaming mouse','rgb','wired','cosmic byte']
  },
  {
    name:'EVOFOX Ronin TKL RGB Mechanical Gaming Keyboard',
    slug:'evofox-ronin-tkl-rgb-mechanical-gaming-keyboard',
    description:'EVOFOX Ronin TKL RGB mechanical wired gaming keyboard with a compact tenkeyless layout, mechanical switches, RGB effects and USB connectivity.',
    short_description:'TKL mechanical RGB gaming keyboard with compact layout.',
    price:2899, original_price:3999,
    image_url:'https://i.ytimg.com/vi/AkPAVyzccus/maxresdefault.jpg',
    category:'Gaming Keyboards', source_store:'Flipkart',
    source_url:'https://www.flipkart.com/evofox-ronin-tkl-rgb-mechanical-wired-usb-tenkeyless-gaming-keyboard-compatible-desktop-laptop-mac/p/itm11cf479fea3a5',
    stock:10,is_featured:true,rating:4.5,review_count:952,tags:['gaming keyboard','mechanical','rgb','evofox']
  },
  {
    name:'Cosmic Byte GS430 Wired Gaming Headset',
    slug:'cosmic-byte-gs430-wired-gaming-headset',
    description:'Cosmic Byte GS430 wired over-ear gaming headset with 40mm drivers, deep bass, microphone and a 2.2m cable.',
    short_description:'Wired gaming headset with microphone and deep bass.',
    price:1305, original_price:1499,
    image_url:'https://techwalker.co.in/uploads/product-imgs/pic/6017567601724841434.png',
    category:'Gaming Headsets', source_store:'Flipkart',
    source_url:'https://www.flipkart.com/cosmicbyte-gs430-wired-headset/p/itm097793e7dfbb2',
    stock:10,is_featured:true,rating:4.2,review_count:13632,tags:['gaming headset','headset','microphone','cosmic byte']
  },
  {
    name:'Cosmic Byte Ares Pro Wireless Gamepad Tri-Mode',
    slug:'cosmic-byte-ares-pro-wireless-gamepad-tri-mode',
    description:'Cosmic Byte Ares Pro wireless gaming controller with wired and wireless connectivity, backlit controls and compatibility with PC, Android and iOS.',
    short_description:'Tri-mode wireless gaming controller for PC and mobile.',
    price:2299, original_price:4499,
    image_url:'https://cdn.grofers.com/da/cms-assets/cms/product/rc-upload-1770619374221-1535.jpg',
    category:'Gaming Controllers', source_store:'Flipkart',
    source_url:'https://www.flipkart.com/cosmic-byte-ares-pro-wireless-gamepad-tri-mode-wi-fi/p/itm42b0014368721',
    stock:10,is_featured:true,rating:4.2,review_count:102,tags:['gaming controller','gamepad','wireless','cosmic byte']
  }
];

await mongoose.connect(process.env.MONGO_URI);
// Remove the old placeholder catalog completely. AccessStore should contain only
// products that have a verified retailer listing and an exact fulfillment URL.
await Product.deleteMany({});
for (const product of products) await Product.create({...product,is_active:true});
console.log(`Ensured ${products.length} verified retailer-linked gaming products are active in MongoDB`);

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
