import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      unique: true,
    },
    companyName: { type: String, default: '' },
    companyEmail: { type: String, default: '' },
    companyPhone: { type: String, default: '' },
    companyAddress: { type: String, default: '' },
    supervisorName: { type: String, default: '' },
    supervisorEmail: { type: String, default: '' },
    supervisorPhone: { type: String, default: '' },
    industry: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);

export default CompanyProfile;