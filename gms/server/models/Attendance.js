import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  id: { type: String }, // support migrating local custom id
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  date: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, default: '--:--' }
});

export default mongoose.model('Attendance', AttendanceSchema);
