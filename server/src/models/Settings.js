import mongoose from 'mongoose';
const settingsSchema=new mongoose.Schema({key:{type:String,unique:true,index:true,required:true},value:{type:String,default:''}},{timestamps:true,versionKey:false});
export default mongoose.model('Settings',settingsSchema);