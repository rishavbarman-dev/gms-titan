import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  id: { type: String }, // support migrating local custom id
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  joinDate: { type: String },
  plan: { type: String, default: 'Basic' },
  expiryDate: { type: String },
  trainer: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  avatar: { type: String }
});

export default mongoose.model('Member', MemberSchema);
