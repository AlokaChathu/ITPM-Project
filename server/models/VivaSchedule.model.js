import mongoose from 'mongoose';

const vivaScheduleSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  studentName: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  venue: { 
    type: String, 
    required: true 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'], 
    default: 'Scheduled' 
  }
}, { timestamps: true });

vivaScheduleSchema.index({ studentId: 1 });

const VivaSchedule = mongoose.model('VivaSchedule', vivaScheduleSchema);

export default VivaSchedule;
