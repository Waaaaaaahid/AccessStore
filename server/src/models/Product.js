import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true}, slug:{type:String,required:true,unique:true,index:true}, description:String, short_description:String,
  price:{type:Number,required:true,min:0}, original_price:{type:Number,min:0}, image_url:String, images:[String], category:String, tags:[String], variants:[String], sizes:[String], stock:{type:Number,default:0,min:0},
  is_active:{type:Boolean,default:true}, is_new:{type:Boolean,default:false}, is_featured:{type:Boolean,default:false}, rating:{type:Number,default:0,min:0,max:5}, review_count:{type:Number,default:0,min:0}
},{timestamps:true});
export default mongoose.model('Product',productSchema);