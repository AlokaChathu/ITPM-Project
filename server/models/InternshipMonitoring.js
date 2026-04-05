import mongoose from "mongoose";

const internshipMonitoringSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    
    
   
  },
  { timestamps: true }
);

const InternshipMonitoring = mongoose.model(
  "InternshipMonitoring",
  internshipMonitoringSchema
);

export default InternshipMonitoring;