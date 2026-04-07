import mongoose from "mongoose";



const userSchema = new mongoose.Schema({

  userType: { type: String, enum: ['student', 'company'], default: 'student' },

  name: { type: String },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true, unique: true },

  verifyOtp: { type: String, default: "" },

  verifyOtpExpireAt: { type: Number, default: 0 },

  isAccountVerified: { type: Boolean, default: false },

  resetOtp: { type: String, default: "" },

  resetOtpExpireAt: { type: Number, default: 0 },

  age:{type:String},

  phone:{type:String,required:true},

  address:{type:String},

  // Company-specific fields

  companyName: { type: String },

  industry: { type: String },

  website: { type: String },

  companyRegNumber: { type: String }

});



const userModel = mongoose.model.user ||  mongoose.model('user',userSchema);



module.exports = userModel;



