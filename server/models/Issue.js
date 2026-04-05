import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    issueType: {
      type: String,
      enum: ['Workload', 'Supervisor', 'Environment', 'Technical', 'Other'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;