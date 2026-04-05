import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    companyAddress: {
      type: String,
      required: true,
      trim: true,
    },
    companyWebsite: {
      type: String,
      default: "",
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    supervisorName: {
      type: String,
      required: true,
      trim: true,
    },
    supervisorEmail: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "company",
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;