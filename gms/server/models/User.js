import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'trainer', 'member'], required: true },
  avatar: { type: String },
  password: { type: String, required: true }
});

export default mongoose.model('User', UserSchema);
