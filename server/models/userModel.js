import mongoose from "mongoose";



const userSchema = new mongoose.Schema(

  {

    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {

      type: String,

      enum: ["Admin", "Student", "Company", "Supervisor"],

      default: "Student",

    },

    status: {

      type: String,

      enum: ["Active", "Suspended", "Pending", "In Progress", "Graded"],

      default: "Active",

    },

    companyApproved: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },

    verifyOtp: { type: String, default: "" },

    verifyOtpExpireAt: { type: Number, default: 0 },

    isAccountVerified: { type: Boolean, default: true },

    resetOtp: { type: String, default: "" },

    resetOtpExpireAt: { type: Number, default: 0 },

    age: { type: String, required: function() { return this.role === 'Student'; } },

    phone: { type: String, required: true },

    address: { type: String, required: true },

    // Company-specific fields (optional for Student, required for Company)
    companyName: { type: String, required: function() { return this.role === 'Company'; } },

    industry: { type: String, required: function() { return this.role === 'Company'; } },

    registrationNumber: { type: String, required: function() { return this.role === 'Company'; } },

    // Grading fields for students
    vivaScore: { type: Number, default: null },
    reportMark: { type: Number, default: null },
    companyRating: { type: Number, default: null },
    finalScore: { type: Number, default: null },
    finalGrade: { type: String, default: null }

  },

  { timestamps: true }

);



const userModel = mongoose.models.user || mongoose.model("user", userSchema);



export default userModel;

